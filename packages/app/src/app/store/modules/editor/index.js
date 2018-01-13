import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import {
  isAllModulesSynced,
  currentSandbox,
  currentModule,
  mainModule,
} from './getters';
import { isModuleSynced } from './computed';
import { loadSandbox } from '../../sequences';

export default Module({
  model,
  state: {
    sandboxes: {},
    currentId: null,
    isForkingSandbox: false,
    currentModuleShortid: null,
    mainModuleShortid: null,
    isLoading: true,
    notFound: false,
    error: null,
    isResizing: false,
    changedModuleShortids: [],
    tabs: [],
    errors: [],
    corrections: [],
    isInProjectView: false,
    forceRender: 0,
    initialPath: '/',
    highlightedLines: [],
    isUpdatingPrivacy: false,
    quickActionsOpen: false,
  },
  getters: {
    isAllModulesSynced,
    currentSandbox,
    currentModule,
    mainModule,
  },
  computed: {
    isModuleSynced,
  },
  signals: {
    sandboxChanged: loadSandbox,
    contentMounted: sequences.onUnload,
    resizingStarted: sequences.startResizing,
    resizingStopped: sequences.stopResizing,
    codeSaved: sequences.saveCode,
    codeChanged: sequences.changeCode,
    saveClicked: sequences.saveChangedModules,
    createZipClicked: sequences.createZip,
    forkSandboxClicked: sequences.forceForkSandbox,
    likeSandboxToggled: sequences.toggleLikeSandbox,
    moduleSelected: sequences.changeCurrentModule,
    moduleDoubleClicked: sequences.unsetDirtyTab,
    tabClosed: sequences.closeTab,
    tabMoved: sequences.moveTab,
    prettifyClicked: sequences.prettifyCode,
    errorsCleared: sequences.clearErrors,
    projectViewToggled: sequences.toggleProjectView,
    previewActionReceived: sequences.handlePreviewAction,
    privacyUpdated: sequences.updatePrivacy,
    quickActionsOpened: sequences.openQuickActions,
    quickActionsClosed: sequences.closeQuickActions,
  },
});
