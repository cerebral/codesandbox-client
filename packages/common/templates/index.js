import angular from './angular';
import vue from './vue';
import react from './react';
import reactTs from './react-ts';
import preact from './preact';
import svelte from './svelte';

export { angular, vue, react, reactTs, preact, svelte };

export default function getDefinition(theme) {
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
    case angular.name:
      return angular;
    default:
      return react;
  }
}
