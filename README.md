# VSCode Beggar

A little utility for asking for money in a VSCode extension.

## Install

```sh
npm install --save vscode-beggar
```

## Usage

Just do the following and this utility will handle the rest. It will prompt users once, usually a couple of minutes after your extension has been initialized for the second time.

```ts

import beggar from 'vscode-beggar';

beggar ({
  id: 'your-extensions-id', // Your unique extension identifier
  title: '[Extension Name] Would you like to say thanks with dollars?', // The question to put in the dialog
  url: 'https://buy.stripe.com/4gweWHcsh71lbN6dQQ', // The URL to open when the user wants to donate
  actions: {
    yes: {
      title: 'Donate now', // Optional title for the "yes" action
      webhook: 'https://telemetry.example.com/1' // Optional telemetry endpoint to query when the user says yes
    },
    no: {
      title: 'Thanks, but I never pay for software', // Optional title for the "no" action
      webhook: 'https://telemetry.example.com/0' // Optional telemetry endpoint to query when the user says no
    },
    cancel: {
      webhook: 'https://telemetry.example.com/2' // Optional telemetry endpoint to query when the dialog is just dismissed
    }
  }
});
```

## License

MIT © Fabio Spampinato
