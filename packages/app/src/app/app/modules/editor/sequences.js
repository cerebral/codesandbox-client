import { sequence } from 'cerebral';
import { set, when, equals } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';

import { addNotification, updateSandboxUrl } from '../../factories';

export const setProjectView = set(
  state`editor.isInProjectView`,
  props`isInProjectView`
);

export const closeTab = actions.closeTab;

export const clearErrors = set(state`editor.errors`, []);

export const moveTab = actions.moveTab;

export const onUnload = actions.warnUnloadingContent;

export const startResizing = set(state`editor.isResizing`, true);

export const stopResizing = set(state`editor.isResizing`, false);

export const createZip = actions.createZip;

export const prettifyCode = [actions.prettifyCode, actions.setCode];

export const setCurrentModule = [actions.addTab, actions.setCurrentModule];

export const unsetDirtyTab = actions.unsetDirtyTab;

export const openDevtools = [function test() {}];

export const forkSandbox = sequence('forkSandbox', [
  actions.forkSandbox,
  actions.moveModuleContent,
  set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
  set(state`editor.currentId`, props`sandbox.id`),
  addNotification('Forked sandbox!', 'success'),
  updateSandboxUrl(props`sandbox`),
]);

export const ensureOwnedSandbox = sequence('ensureOwnedSandbox', [
  when(state`editor.currentSandbox.owned`),
  {
    true: [],
    false: forkSandbox,
  },
]);

export const addNpmDependency = [
  ensureOwnedSandbox,
  set(state`editor.workspace.isProcessingDependencies`, true),
  actions.addNpmDependency,
  set(
    state`editor.sandboxes.${state`editor.currentId`}.npmDependencies`,
    props`npmDependencies`
  ),
  set(state`editor.workspace.isProcessingDependencies`, false),
];

export const toggleLikeSandbox = [
  when(state`editor.currentSandbox.userLiked`),
  {
    true: actions.unlikeSandbox,
    false: actions.likeSandbox,
  },
];

export const forceForkSandbox = [
  when(state`editor.currentSandbox.owned`),
  {
    true: [
      actions.confirmForkingOwnSandbox,
      {
        confirmed: forkSandbox,
        cancelled: [],
      },
    ],
    false: forkSandbox,
  },
];

export const changeCode = [actions.setCode, actions.addChangedModule];

export const saveChangedModules = [
  actions.outputChangedModules,
  actions.saveChangedModules,
  set(state`editor.changedModuleShortids`, []),
];

export const saveCode = [
  ensureOwnedSandbox,
  when(state`editor.preferences.settings.prettifyOnSaveEnabled`),
  {
    true: [actions.prettifyCode, actions.setCode],
    false: [],
  },
  actions.saveModuleCode,
];

export const loadSandbox = [
  when(state`editor.sandboxes.${props`id`}`),
  {
    true: set(state`editor.currentId`, props`id`),
    false: [
      set(state`editor.isLoading`, true),
      set(state`editor.notFound`, false),
      actions.getSandbox,
      {
        success: [
          set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
          set(state`editor.currentId`, props`sandbox.id`),
          actions.setCurrentModuleShortid,
          actions.setMainModuleShortid,
          actions.setInitialTab,
        ],
        notFound: set(state`editor.notFound`, true),
        error: set(state`editor.error`, props`error.message`),
      },
      set(state`editor.isLoading`, false),
    ],
  },
];

export const handlePreviewAction = [
  equals(props`action.action`),
  {
    notification: addNotification(
      props`action.title`,
      props`action.notificationType`,
      props`action.timeAlive`
    ),
    'show-error': actions.addErrorFromPreview,
    'show-correction': actions.addCorrectionFromPreview,
    'source.module.rename': actions.renameModuleFromPreview,
    'source.dependencies.add': [
      set(props`name`, props`action.dependency`),
      addNpmDependency,
      actions.forceRender,
    ],
    'editor.open-module': [
      actions.outputModuleIdFromActionPath,
      when(props`id`),
      {
        true: setCurrentModule,
        false: [],
      },
    ],
    otherwise: [],
  },
];