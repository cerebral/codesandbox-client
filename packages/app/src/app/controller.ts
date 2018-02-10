import { Controller } from '@cerebral/fluent';
import * as store from './store';

let Devtools = null;

if (process.env.NODE_ENV !== 'production') {
  Devtools = require('cerebral/devtools').default; // eslint-disable-line
}

export default Controller(store.module, {
  devtools:
    Devtools &&
    Devtools({
      host: 'localhost:8383',
      reconnect: false,
    }),
});
