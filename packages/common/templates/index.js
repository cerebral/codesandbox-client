import ReactIcon from 'common/components/logos/React';
import PreactIcon from 'common/components/logos/Preact';
import VueIcon from 'common/components/logos/Vue';
import SvelteIcon from 'common/components/logos/Svelte';

import { decorateSelector } from '../theme';

import configurations from './configuration';

export const react = {
  name: 'create-react-app',
  niceName: 'React',
  url: 'https://github.com/facebookincubator/create-react-app',
  shortid: 'new',
  Icon: ReactIcon,
  color: decorateSelector(() => '#6CAEDD'),
  configurations: {
    '/package.json': configurations.packageJSON,
    '/.prettierrc': configurations.prettierRC,
    '/sandbox.config.json': {
      description: 'Configuration for the sandbox itself',
    },
  },

  alterDeploymentData: apiData => ({
    ...apiData,
    package: {
      ...apiData.package,
      devDependencies: {
        ...apiData.package.devDependencies,
        serve: '^5.0.1',
      },
      scripts: {
        ...apiData.package.scripts,
        'now-start': 'cd build && serve -s ./',
      },
    },
  }),
};

export const reactTs = {
  name: 'create-react-app-typescript',
  niceName: 'React + TS',
  url: 'https://github.com/wmonk/create-react-app-typescript',
  shortid: 'react-ts',
  color: decorateSelector(() => '#009fff'),
  configurations,

  sourceConfig: {
    typescript: true,
    entry: 'index.tsx',
  },
};

export const vue = {
  name: 'vue-cli',
  niceName: 'Vue',
  url: 'https://github.com/vuejs/vue-cli',
  shortid: 'vue',
  Icon: VueIcon,
  color: decorateSelector(() => '#41B883'),
  configurations,

  alterDeploymentData: apiData => ({
    ...apiData,
    package: {
      ...apiData.package,
      devDependencies: {
        ...apiData.package.devDependencies,
        serve: '^5.0.1',
      },
      scripts: {
        ...apiData.package.scripts,
        'now-start': 'cd dist && serve -s ./',
      },
    },
  }),
};

export const preact = {
  name: 'preact-cli',
  niceName: 'Preact',
  url: 'https://github.com/developit/preact-cli',
  shortid: 'preact',
  Icon: PreactIcon,
  color: decorateSelector(() => '#AD78DC'),
  configurations,

  alterDeploymentData: apiData => ({
    ...apiData,
    package: {
      ...apiData.package,
      devDependencies: {
        ...apiData.package.devDependencies,
        serve: '^5.0.1',
      },
      scripts: {
        ...apiData.package.scripts,
        'now-start': 'cd build && serve -s ./',
      },
    },
  }),
};

export const svelte = {
  name: 'svelte',
  niceName: 'Svelte',
  url: 'https://github.com/sveltejs/svelte',
  shortid: 'svelte',
  Icon: SvelteIcon,
  color: decorateSelector(() => '#AA1E1E'),
  configurations,

  alterDeploymentData: apiData => ({
    ...apiData,
    package: {
      ...apiData.package,
      devDependencies: {
        ...apiData.package.devDependencies,
        serve: '^5.0.1',
      },
      scripts: {
        ...apiData.package.scripts,
        'now-start': 'cd public && serve -s ./',
      },
    },
  }),
};

export default function getDefinition(
  theme:
    | 'create-react-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'create-react-app-typescript'
) {
  if (!theme) {
    return react;
  }

  switch (theme) {
    case react.name:
      return react;
    case vue.name:
      return vue;
    case preact.name:
      return preact;
    case reactTs.name:
      return reactTs;
    case svelte.name:
      return svelte;
    default:
      return react;
  }
}
