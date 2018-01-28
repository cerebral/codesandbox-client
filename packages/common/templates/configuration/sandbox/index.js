// @flow
import type { ConfigurationFile } from '../types';
import ui from './ui';

const config: ConfigurationFile = {
  title: 'sandbox.config.json',
  type: 'sandbox',
  description: 'Configuration specific to the current sandbox.',
  moreInfoUrl: 'https://codesandbox.io/docs/config-file',
  ui,
  getDefaultCode: () =>
    JSON.stringify(
      {
        infiniteLoopProtection: true,
        hardReloadOnChange: false,
      },
      null,
      2
    ),
};

export default config;
