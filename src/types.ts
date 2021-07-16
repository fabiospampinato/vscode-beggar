
/* TYPES */

type Options = {
  id: string,
  title: string,
  url: string,
  actions?: {
    yes?: {
      title?: string,
      webhook?: string
    },
    no?: {
      title?: string,
      webhook?: string
    },
    cancel?: {
      webhook?: string
    }
  }
};

type StateTouchbase = {
  state: 0,
  timestamp: number
};

type StateTriggered = {
  state: 1,
  timestamp: number
};

type State = StateTouchbase | StateTriggered;

/* EXPORT */

export {Options, State};
