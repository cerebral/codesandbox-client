import { sequence, sequenceWithProps } from 'fluent';
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

export const toggleLikeSandbox = sequenceWithProps<{ id: string }>((s) =>
	s
		.when(({ state, props }) => state.editor.sandboxes.get(props.id).userLiked)
		.paths({
			true: (s) =>
				s.action(actions.unlikeSandbox).action(({ state, props }) => {
					state.editor.sandboxes.get(props.id).likeCount -= 1;
				}),
			false: (s) =>
				s.action(actions.likeSandbox).action(({ state, props }) => {
					state.editor.sandboxes.get(props.id).likeCount += 1;
				})
		})
		.action(({ state, props }) => {
			state.editor.sandboxes.get(props.id).userLiked = !state.editor.sandboxes.get(props.id).userLiked;
		})
);
export const forceForkSandbox = sequence((s) =>
	s.when(({ state }) => state.editor.currentSandbox.get().owned).paths({
		true: (s) =>
			s.branch(actions.confirmForkingOwnSandbox).paths({
				confirmed: (s) => s.sequence(forkSandbox),
				cancelled: (s) => s
			}),
		false: (s) => s.sequence(forkSandbox)
	})
);

export const changeCode = sequence((s) =>
	s.action(actions.setCode).action(actions.addChangedModule).action(actions.unsetDirtyTab)
);

export const saveChangedModules = sequence((s) =>
	s
		.sequence(ensureOwnedSandbox)
		.action(actions.outputChangedModules)
		.action(actions.saveChangedModules)
		.action(({ state }) => {
			state.editor.changedModuleShortids = [];
		})
		.when(({ state }) => state.editor.currentSandbox.get().originalGit)
		.paths({
			true: (s) =>
				s.when(({ state }) => state.workspace.openedWorkspaceItem === 'github').paths({
					true: (s) => s.sequence(fetchGitChanges),
					false: (s) => s
				}),
			false: (s) => s
		})
);

export const saveCode = sequenceWithProps<{ code?: string }>((s) =>
	s
		.sequence(ensureOwnedSandbox)
		.when(({ props }) => props.code)
		.paths({
			true: (s) => s.action(actions.setCode),
			false: (s) => s
		})
		.when(({ state }) => state.preferences.settings.prettifyOnSaveEnabled)
		.paths({
			true: (s) =>
				s.branch(actions.prettifyCode).paths({
					success: (s) => s.action(actions.setCode),
					error: (s) => s
				}),
			false: (s) => s
		})
		.action(actions.saveModuleCode)
		.action(actions.setModuleSaved)
		.when(({ state }) => state.editor.currentSandbox.get().originalGit)
		.paths({
			true: (s) =>
				s.when(({ state }) => state.workspace.openedWorkspaceItem === 'github').paths({
					true: (s) => s.seqeunce(fetchGitChanges),
					false: (s) => s
				}),
			false: (s) => s
		})
);

export const addNpmDependency = sequence<{ version?: string }>((s) =>
	s
		.sequence(closeModal)
		.sequence(ensureOwnedSandbox)
		.when(({ props }) => props.version)
		.paths({
			true: (s) => s,
			false: (s) => s.action(actions.getLatestVersion)
		})
		.action(actions.addNpmDependencyToPackage)
		.sequence(saveCode)
);

export const removeNpmDependency = sequence((s) =>
	s.sequence(ensureOwnedSandbox).action(actions.removeNpmDependencyFromPackage).sequence(saveCode)
);

export const updateSandboxPackage = sequence((s) => s.action(actions.updateSandboxPackage).sequence(saveCode));

export const handlePreviewAction = sequenceWithProps<{ action: any }>((s) =>
	s.equals(({ props }) => props.action.action).paths({
		notification: (s) => s.action(addNotification('BLAH', 'success')),
		'show-error': (s) => s.action(actions.addErrorFromPreview),
		'show-correction': (s) => s.action(actions.addCorrectionFromPreview),
		'show-glyph': (s) => s.action(actions.addGlyphFromPreview),
		'source.module.rename': (s) => s.action(actions.renameModuleFromPreview),
		'source.dependencies.add': (s) =>
			s
				.action(({ state, props }) => ({ name: props.action.dependency }))
				.sequence(addNpmDependency)
				.action(actions.forceRender),
		'editor.open-module': (s) =>
			s.action(actions.outputModuleIdFromActionPath).when(({ props }) => props.id).paths({
				true: (s) => s.action(setCurrentModule(({ props }) => props.id)),
				false: (s) => s
			}),
		otherwise: (s) => s
	})
);

export const setPreviewBounds = sequence((s) => s.action(actions.setPreviewBounds));
