import { sequence } from 'fluent';
import * as actions from './actions';
import { closeTabByIndex } from '../../actions';
import { ensureOwnedSandbox, forkSandbox, fetchGitChanges, closeModal } from '../../sequences';

import { setCurrentModule, addNotification } from '../../factories';

export const openQuickActions = sequence((s) =>
	s.action('openQuickActions', ({ state }) => {
		state.editor.quickActionsOpen = true;
	})
);

export const closeQuickActions = sequence((s) =>
	s.action('closeQuickActions', ({ state }) => {
		state.editor.quickActionsOpen = false;
	})
);

export const toggleProjectView = sequence((s) =>
	s.action('toggleProjectView', ({ state }) => {
		state.editor.isInProjectView = !state.editor.isInProjectView;
	})
);

export const closeTab = sequence((s) => s.action(closeTabByIndex).action(actions.setCurrentModuleByTab));

export const clearErrors = sequence((s) =>
	s.action('clearErrors', ({ state }) => {
		state.editor.errors = [];
		state.editor.corrections = [];
		state.editor.glyphs = [];
	})
);

export const moveTab = sequence((s) => s.action(actions.moveTab));

export const onUnload = sequence((s) => s.action(actions.warnUnloadingContent));

export const startResizing = sequence((s) =>
	s.action('startResizing', ({ state }) => {
		state.editor.isResizing = true;
	})
);

export const stopResizing = sequence((s) =>
	s.action('stopResizing', ({ state }) => {
		state.editor.isResizing = false;
	})
);

export const createZip = sequence((s) => s.action(actions.createZip));

export const prettifyCode = sequence((s) =>
	s.branch(actions.prettifyCode).paths({
		success: (s) => s.action(actions.setCode).action(actions.addChangedModule),
		invalidPrettierSandboxConfig: (s) => s.action(addNotification('blah', 'error')),
		error: (s) => s.action(addNotification('buh', 'error'))
	})
);

export const changeCurrentModule = sequence((s) => s.action(setCurrentModule(({ props }) => props.id)));

export const unsetDirtyTab = sequence((s) => s.action(actions.unsetDirtyTab));

export const updatePrivacy = sequence((s) =>
	s.branch(actions.ensureValidPrivacy).paths({
		valid: (s) =>
			s
				.action(({ state }) => {
					state.editor.isUpdatingPrivacy = true;
				})
				.action(actions.updatePrivacy)
				.action(({ state }) => {
					state.editor.isUpdatingPrivacy = false;
				}),
		invalid: (s) => s
	})
);

export const toggleLikeSandbox = sequence((s) => s.action())[
	(when(state`editor.sandboxes.${props`id`}.userLiked`),
	{
		true: [ actions.unlikeSandbox, increment(state`editor.sandboxes.${props`id`}.likeCount`, -1) ],
		false: [ actions.likeSandbox, increment(state`editor.sandboxes.${props`id`}.likeCount`, 1) ]
	},
	toggle(state`editor.sandboxes.${props`id`}.userLiked`))
];

export const forceForkSandbox = [
	when(state`editor.currentSandbox.owned`),
	{
		true: [
			actions.confirmForkingOwnSandbox,
			{
				confirmed: forkSandbox,
				cancelled: []
			}
		],
		false: forkSandbox
	}
];

export const changeCode = [ actions.setCode, actions.addChangedModule, actions.unsetDirtyTab ];

export const saveChangedModules = [
	ensureOwnedSandbox,
	actions.outputChangedModules,
	actions.saveChangedModules,
	set(state`editor.changedModuleShortids`, []),
	when(state`editor.currentSandbox.originalGit`),
	{
		true: [
			when(state`workspace.openedWorkspaceItem`, (item) => item === 'github'),
			{
				true: fetchGitChanges,
				false: []
			}
		],
		false: []
	}
];

export const saveCode = [
	ensureOwnedSandbox,
	when(props`code`),
	{
		true: actions.setCode,
		false: []
	},
	when(state`preferences.settings.prettifyOnSaveEnabled`),
	{
		true: [
			actions.prettifyCode,
			{
				success: actions.setCode,
				error: []
			}
		],
		false: []
	},
	actions.saveModuleCode,
	actions.setModuleSaved,
	when(state`editor.currentSandbox.originalGit`),
	{
		true: [
			when(state`workspace.openedWorkspaceItem`, (item) => item === 'github'),
			{
				true: fetchGitChanges,
				false: []
			}
		],
		false: []
	}
];

export const addNpmDependency = [
	closeModal,
	ensureOwnedSandbox,
	when(props`version`),
	{
		true: [],
		false: [ actions.getLatestVersion ]
	},
	actions.addNpmDependencyToPackage,
	saveCode
];

export const removeNpmDependency = [ ensureOwnedSandbox, actions.removeNpmDependencyFromPackage, saveCode ];

export const updateSandboxPackage = [ actions.updateSandboxPackage, saveCode ];

export const handlePreviewAction = [
	equals(props`action.action`),
	{
		notification: addNotification(props`action.title`, props`action.notificationType`, props`action.timeAlive`),
		'show-error': actions.addErrorFromPreview,
		'show-correction': actions.addCorrectionFromPreview,
		'show-glyph': actions.addGlyphFromPreview,
		'source.module.rename': actions.renameModuleFromPreview,
		'source.dependencies.add': [
			set(props`name`, props`action.dependency`),
			addNpmDependency,
			actions.forceRender
		],
		'editor.open-module': [
			actions.outputModuleIdFromActionPath,
			when(props`id`),
			{
				true: setCurrentModule(props`id`),
				false: []
			}
		],
		otherwise: []
	}
];

export const setPreviewBounds = [ actions.setPreviewBounds ];
