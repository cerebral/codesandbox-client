import { Dictionary, ComputedValue } from '@cerebral/fluent';
import * as sequences from './sequences';
import { loadSandbox } from '../../sequences';

type Badge = {
	id: string;
	name: string;
	visible: boolean;
};
type Author = {
	avatarUrl: string;
	badges: Badge[];
	forkedCount: number;
	givenLikeCount: number;
	id: string;
	name: string;
	receivedLikeCount: number;
	sandboxCount: number;
	showcasedSandboxShortid: string;
	subscriptionSince: string;
	username: string;
	viewCount: number;
};

type Directory = {
	directoryShortid: string;
	id: string;
	shortid: string;
	sourceId: string;
	title: string;
};

type Module = {
	code: string;
	directoryShortid: string;
	id: string;
	isBinary: boolean;
	shortid: string;
	sourceId: string;
	title: string;
};

type Git = {
	branch: string;
	commitSha: string;
	path: string;
	repo: string;
	username: string;
};

type Sandbox = {
	author: Author;
	description: string;
	directories: Directory[];
	entry: string;
	externalResources: string[];
	forkCount: number;
	forkedFromSandbox: {
		viewCount: number;
		updatedAt: string;
		title: string;
		template: string;
		privacy: number;
		likeCount: number;
		insertedAt: string;
		id: string;
		git: Git;
		forkCount: number;
	};
	git: Git;
	id: string;
	likeCount: number;
	modules: Module[];
	npmDependencies: Dictionary<string>;
	originalGit: Git;
	originalGitCommitSha: string;
	owned: boolean;
	privacy: number;
	sourceId: string;
	tags: string[];
	template: string;
	title: string;
	userLiked: boolean;
	version: number;
	viewCount: number;
};

type Tab = {
	type: string;
	moduleShortid: string;
	dirty: boolean;
};

type Error = {
	column: number;
	line: number;
	message: string;
	title: string;
	moduleId: string;
};

type Glyph = {
	line: number;
	className: string;
	moduleId: string;
};

type Correction = {
	column: number;
	line: number;
	message: string;
	source: string;
	moduleId: string;
};

export type State = {
	currentId: string;
	currentModuleShortid: string;
	isForkingSandbox: boolean;
	mainModuleShortid: string;
	sandboxes: Dictionary<Sandbox>;
	isLoading: boolean;
	notFound: boolean;
	error: string;
	isResizing: boolean;
	changedModuleShortids: string[];
	tabs: Tab[];
	errors: Error[];
	glyphs: Glyph[];
	corrections: Correction[];
	isInProjectView: boolean;
	forceRender: number;
	initialPath: string;
	highlightedLines: number[];
	isUpdatingPrivacy: boolean;
	quickActionsOpen: boolean;
	previewWindow: {
		width: number;
		height: number;
		x: number;
		y: number;
	};
	isAllModulesSynced: ComputedValue<boolean>;
	currentSandbox: ComputedValue<Sandbox>;
	currentModule: ComputedValue<Module>;
	mainModule: ComputedValue<Module>;
	currentPackageJSON: ComputedValue<Module>;
	currentPackageJSONCode: ComputedValue<string>;
	parsedConfigurations: ComputedValue<any>;
};

export type Signals = {
	addNpmDependency: typeof sequences.addNpmDependency;
	npmDependencyRemoved: typeof sequences.removeNpmDependency;
	sandboxChanged: typeof loadSandbox;
	contentMounted: typeof sequences.onUnload;
	resizingStarted: typeof sequences.startResizing;
	resizingStopped: typeof sequences.stopResizing;
	codeSaved: typeof sequences.saveCode;
	codeChanged: typeof sequences.changeCode;
	saveClicked: typeof sequences.saveChangedModules;
	createZipClicked: typeof sequences.createZip;
	forkSandboxClicked: typeof sequences.forceForkSandbox;
	likeSandboxToggled: typeof sequences.toggleLikeSandbox;
	moduleSelected: typeof sequences.changeCurrentModule;
	moduleDoubleClicked: typeof sequences.unsetDirtyTab;
	tabClosed: typeof sequences.closeTab;
	tabMoved: typeof sequences.moveTab;
	prettifyClicked: typeof sequences.prettifyCode;
	errorsCleared: typeof sequences.clearErrors;
	projectViewToggled: typeof sequences.toggleProjectView;
	previewActionReceived: typeof sequences.handlePreviewAction;
	privacyUpdated: typeof sequences.updatePrivacy;
	quickActionsOpened: typeof sequences.openQuickActions;
	quickActionsClosed: typeof sequences.closeQuickActions;
	setPreviewBounds: typeof sequences.setPreviewBounds;
};
