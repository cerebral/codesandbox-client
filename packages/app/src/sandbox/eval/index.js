// @flow
import {
  react,
  vue,
  svelte,
  preact,
  reactTs,
  angular5,
} from 'common/templates';

import reactPreset from './presets/create-react-app';
import reactTsPreset from './presets/create-react-app-typescript';
import vuePreset from './presets/vue-cli';
import preactPreset from './presets/preact-cli';
import sveltePreset from './presets/svelte';
import angular5Preset from './presets/angular5';

export default function getPreset(template: string) {
  switch (template) {
    case react.name:
      return reactPreset();
    case reactTs.name:
      return reactTsPreset();
    case vue.name:
      return vuePreset();
    case preact.name:
      return preactPreset();
    case svelte.name:
      return sveltePreset();
    case angular5.name:
      return angular5Preset();
    default:
      return reactPreset();
  }
}
