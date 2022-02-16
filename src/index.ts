
/* IMPORT */

import {readFile, writeFile} from 'atomically';
import * as envPaths from 'env-paths';
import fetch from 'node-fetch';
import * as path from 'path';
import * as vscode from 'vscode';
import {Options, State} from './types';

/* MAIN */

const beggar = async ( options: Options ): Promise<true | false | undefined> => {

  /* VARIABLES */

  const {id, title, url, actions} = options;
  const yesTitle = actions?.yes?.title || 'Donate';
  const yesWebhook = actions?.yes?.webhook;
  const noTitle = actions?.no?.title || 'Sorry, I can\'t :(';
  const noWebhook = actions?.no?.webhook;
  const cancelWebhook = actions?.cancel?.webhook;

  const isPromptDisabled = vscode.workspace.getConfiguration ().get ( 'donations.disablePrompt' ) === true;
  const isTelemetryDisabled = ( vscode.env['isTelemetryEnabled'] === false || vscode.workspace.getConfiguration ().get ( 'telemetry.enableTelemetry' ) === false );

  const folderPath = envPaths ( 'vscode-beggar', { suffix: '' } ).data;
  const filePath = path.join ( folderPath, `${id}.json` );

  if ( isPromptDisabled ) return;

  /* CHECKING CURRENT STATE */

  let state;

  try {

    const stateRaw = await readFile ( filePath, { encoding: 'utf8' } );
    state = JSON.parse ( stateRaw );

    if ( 'state' in state && state.state !== 0 ) return; // Already asked

  } catch {

    try { // Setting touchbase state

      const state: State = { state: 0, timestamp: Date.now () };

      await writeFile ( filePath, JSON.stringify ( state ) );

    } catch {}

    return; // Asking another time, it's too soon now

  }

  /* CHECKING ELAPSED ENOUGH TIME */

  const elapsed = Date.now () - ( state.timestamp || Infinity );

  if ( elapsed < 86400000 ) return; // Too soon, let's wait at least a day

  /* WAITING */

  const delay = Math.round ( 30000 + ( 120000 * Math.random () ) ); // Waiting between 30s and 2:30m

  await new Promise<void> ( resolve => setTimeout ( resolve, delay ) );

  /* SETTING TRIGGERED STATE */

  try {

    const state: State = { state: 1, timestamp: Date.now () };

    await writeFile ( filePath, JSON.stringify ( state ) );

  } catch {

    return; // Attempting another time, or we'll bother people multiple times later on

  }

  /* ASKING */

  const result = await vscode.window.showErrorMessage ( title, noTitle, yesTitle ); // Error => Persistent message

  if ( !result ) { // Cancel

    try { // Setting touchbase state, asking again later for a clearer answer

      const state: State = { state: 0, timestamp: Date.now () };

      await writeFile ( filePath, JSON.stringify ( state ) );

    } catch {}

    if ( !isTelemetryDisabled && cancelWebhook ) fetch ( cancelWebhook );

    return;

  } else if ( result === yesTitle ) { // Yes

    vscode.env.openExternal ( vscode.Uri.parse ( url ) );

    if ( !isTelemetryDisabled && yesWebhook ) fetch ( yesWebhook );

    return true;

  } else if ( result === noTitle ) { // No

    if ( !isTelemetryDisabled && noWebhook ) fetch ( noWebhook );

    return false;

  }

};

/* EXPORT */

export default beggar;
