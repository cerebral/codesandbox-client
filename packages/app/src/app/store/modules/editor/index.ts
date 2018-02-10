import { Module, Dictionary, Computed } from '@cerebral/fluent';
import * as sequences from './sequences';
import * as computed from './computed';
import { loadSandbox } from '../../sequences';
import { State, Signals } from './types';

const state: State = {
	sandboxes: Dictionary({}),
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
	glyphs: [],
	corrections: [],
	isInProjectView: false,
	forceRender: 0,
	initialPath: '/',
	highlightedLines: [],
	isUpdatingPrivacy: false,
	quickActionsOpen: false,
	previewWindow: {
		height: undefined,
		width: undefined,
		x: 0,
		y: 0
	},
	isAllModulesSynced: Computed(computed.isAllModulesSynced),
	currentSandbox: Computed(computed.currentSandbox),
	currentModule: Computed(computed.currentModule),
	mainModule: Computed(computed.mainModule),
	currentPackageJSON: Computed(computed.currentPackageJSON),
	currentPackageJSONCode: Computed(computed.currentPackageJSONCode),
	parsedConfigurations: Computed(computed.parsedConfigurations)
};

const signals: Signals = {
	addNpmDependency: sequences.addNpmDependency,
	npmDependencyRemoved: sequences.removeNpmDependency,
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
	setPreviewBounds: sequences.setPreviewBounds
};

export default Module({
	state,
	signals
});
