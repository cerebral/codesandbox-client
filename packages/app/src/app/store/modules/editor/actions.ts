import { Context, BranchContext } from 'fluent';
import { fromPairs, toPairs, sortBy } from 'lodash';
import { clone } from 'mobx-state-tree';

function sortObjectByKeys(object) {
	return fromPairs(sortBy(toPairs(object), 0));
}

export async function getLatestVersion({ props, api }: Context<{ name: string }>) {
	const { name } = props;

	return api.get(`/dependencies/${name}@latest`).then(({ version }) => ({ version })).catch(() => {});
}

export function addNpmDependencyToPackage({
	state,
	props
}: Context<{ isDev: boolean; name: string; version: string }>) {
	const { parsed } = state.editor.parsedConfigurations.get().package;
	const type = props.isDev ? 'devDependencies' : 'dependencies';

	parsed[type] = parsed[type] || {};
	parsed[type][props.name] = props.version || 'latest';
	parsed[type] = sortObjectByKeys(parsed[type]);

	return {
		code: JSON.stringify(parsed, null, 2),
		moduleShortid: state.editor.currentPackageJSON.get().shortid
	};
}

export function removeNpmDependencyFromPackage({ state, props }: Context<{ name: string }>) {
	const { parsed } = state.editor.parsedConfigurations.get().package;

	delete parsed.dependencies[props.name];
	parsed.dependencies = sortObjectByKeys(parsed.dependencies);

	return {
		code: JSON.stringify(parsed, null, 2),
		moduleShortid: state.editor.currentPackageJSON.get().shortid
	};
}

export function updateSandboxPackage({ state }: Context) {
	const { parsed } = state.editor.parsedConfigurations.get().package;
	const sandbox = state.editor.currentSandbox.get();

	parsed.keywords = sandbox.tags;
	parsed.name = sandbox.title || sandbox.id;
	parsed.description = sandbox.description;

	return {
		code: JSON.stringify(parsed, null, 2),
		moduleShortid: state.editor.currentPackageJSON.get().shortid
	};
}

export function setModuleSaved({ props, state }: Context<any>) {
	const changedModuleShortids = state.editor.changedModuleShortids;
	const indexToRemove = changedModuleShortids.indexOf(props.shortid);

	state.editor.changedModuleShortids.splice(indexToRemove, 1);
}

export function ensureValidPrivacy({
	props,
	path
}: BranchContext<
	{
		valid: {};
		invalid: {};
	},
	any
>) {
	const privacy = Number(props.privacy);

	return Number.isNaN(privacy) ? path.invalid({}) : path.valid({ privacy });
}

export function setCurrentModuleByTab({ state, props }: Context<any>) {
	const tabs = state.editor.tabs;
	const currentModuleShortid = state.editor.currentModuleShortid;
	const closedCurrentTab = !tabs.find((t) => t.moduleShortid === currentModuleShortid);

	if (closedCurrentTab) {
		const index = state.editor.tabs.length - 1 >= props.tabIndex ? props.tabIndex : props.tabIndex - 1;
		const moduleShortid = state.editor.tabs[index].moduleShortid;

		state.editor.currentModuleShortid = moduleShortid;
	}
}

export function updatePrivacy({ api, props, state }: Context<any>) {
	const id = state.editor.currentId;

	return api
		.patch(`/sandboxes/${id}/privacy`, {
			sandbox: {
				privacy: props.privacy
			}
		})
		.then(() => undefined);
}

export function forceRender({ state }: Context) {
	state.editor.forceRender = state.editor.forceRender + 1;
}

export function outputModuleIdFromActionPath({ state, props, utils }: Context<any>) {
	const sandbox = state.editor.currentSandbox.get();
	const module = utils.resolveModule(props.action.path.replace(/^\//, ''), sandbox.modules, sandbox.directories);

	return { id: module ? module.id : null };
}

export function renameModuleFromPreview({ state, props, utils }: Context<any>) {
	const sandbox = state.editor.currentSandbox.get();
	const module = utils.resolveModule(props.action.path.replace(/^\//, ''), sandbox.modules, sandbox.directories);

	if (module) {
		const moduleIndex = sandbox.modules.findIndex((moduleEntry) => moduleEntry.id === module.id);

		state.editor.sandboxes[sandbox.id].modules[moduleIndex].title = props.title;
	}
}

export function addErrorFromPreview({ state, props, utils }: Context<any>) {
	const sandbox = state.editor.currentSandbox.get();
	const module = utils.resolveModule(props.action.path.replace(/^\//, ''), sandbox.modules, sandbox.directories);
	const error = {
		moduleId: module.id,
		column: props.action.column,
		line: props.action.line,
		message: props.action.message,
		title: props.action.title
	};

	if (module) {
		state.editor.errors.push(error);
	}
}

export function addGlyphFromPreview({ state, props, utils }: Context<any>) {
	const sandbox = state.editor.currentSandbox.get();
	const module = utils.resolveModule(props.action.path.replace(/^\//, ''), sandbox.modules, sandbox.directories);
	const glyph = {
		moduleId: module.id,
		line: props.action.line,
		className: props.action.className
	};

	if (module) {
		state.editor.glyphs.push(glyph);
	}
}

export function addCorrectionFromPreview({ state, props, utils }: Context<any>) {
	const sandbox = state.editor.currentSandbox.get();
	const module = utils.resolveModule(props.action.path.replace(/^\//, ''), sandbox.modules, sandbox.directories);
	const correction = {
		moduleId: module.id,
		column: props.action.column,
		line: props.action.line,
		message: props.action.message,
		source: props.action.source
	};

	if (module) {
		state.editor.corrections.push(correction);
	}
}

export function moveTab({ state, props }: Context<any>) {
	const tabs = state.editor.tabs;
	const tab = tabs[props.prevIndex];

	state.editor.tabs.splice(props.prevIndex, 1);
	state.editor.tabs.splice(props.nextIndex, 0, tab);
}

export function unsetDirtyTab({ state }: Context<any>) {
	const currentModule = state.editor.currentModule.get();
	const tabs = state.editor.tabs;
	const tabIndex = tabs.findIndex((tab) => tab.moduleShortid === currentModule.shortid);

	state.editor.tabs[tabIndex].dirty = false;
}

export function outputChangedModules({ state }: Context<any>) {
	const changedModuleShortids = state.editor.changedModuleShortids;
	const sandbox = state.editor.currentSandbox.get();

	return {
		changedModules: sandbox.modules.filter((module) => changedModuleShortids.indexOf(module.shortid) >= 0)
	};
}

export function confirmForkingOwnSandbox({
	browser,
	path
}: BranchContext<
	{
		confirmed: {};
		cancelled: {};
	},
	any
>) {
	return browser.confirm('Do you want to fork your own sandbox?') ? path.confirmed({}) : path.cancelled({});
}

export function unlikeSandbox({ api, props }: Context<any>) {
	return api.request({
		method: 'DELETE',
		url: `/sandboxes/${props.id}/likes`,
		body: {
			id: props.id
		}
	});
}

export function likeSandbox({ api, props }: Context<any>) {
	return api.post(`/sandboxes/${props.id}/likes`, {
		id: props.id
	});
}

export function createZip({ utils, state }: Context<any>) {
	const sandbox = state.editor.currentSandbox.get();

	utils.zipSandbox(sandbox);
}

export function addChangedModule({ state, props }: Context<any>) {
	const moduleShortid = props.moduleShortid || state.editor.currentModuleShortid;

	if (state.editor.changedModuleShortids.indexOf(moduleShortid) === -1) {
		state.editor.changedModuleShortids.push(moduleShortid);
	}
}

export function saveChangedModules({ props, api, state }: Context<any>) {
	const sandboxId = state.editor.currentId;

	return api
		.put(`/sandboxes/${sandboxId}/modules/mupdate`, {
			modules: props.changedModules
		})
		.then(() => undefined);
}

export function prettifyCode({
	utils,
	state,
	props,
	path
}: BranchContext<
	{
		success: {};
		error: {};
		invalidPrettierSandboxConfig: {};
	},
	any
>) {
	const sandbox = state.editor.currentSandbox.get();
	const moduleToPrettify = sandbox.modules.find((module) => module.shortid === props.moduleShortid);
	let config = state.preferences.settings.prettiferConfig;
	const configFromSandbox = sandbox.modules.find(
		(module) => module.directoryShortid == null && module.title === '.prettierrc'
	);

	if (configFromSandbox) {
		try {
			config = JSON.parse(configFromSandbox.code);
		} catch (e) {
			return path.invalidPrettierSandboxConfig({});
		}
	}

	return utils
		.prettify(moduleToPrettify.title, moduleToPrettify.code, config)
		.then((newCode) => path.success({ code: newCode }))
		.catch((error) => path.error({ error }));
}

export function saveModuleCode({ props, state, api }: Context<any>) {
	const sandbox = state.editor.currentSandbox.get();
	const moduleToSave = sandbox.modules.find((module) => module.shortid === props.moduleShortid);

	return api.put(`/sandboxes/${sandbox.id}/modules/${moduleToSave.shortid}`, {
		module: { code: moduleToSave.code }
	});
}

export function getCurrentModuleId({ state }: Context<any>) {
	const currentModuleShortid = state.editor.currentModuleShortid;
	const sandbox = state.editor.currentSandbox.get();

	return {
		moduleId: sandbox.modules.find((module) => module.shortid === currentModuleShortid).id
	};
}

export function warnUnloadingContent({ browser, state }: Context<any>) {
	browser.onUnload((event) => {
		if (!state.editor.isAllModulesSynced.get()) {
			const returnMessage = 'You have not saved all your modules, are you sure you want to close this tab?';

			event.returnValue = returnMessage; // eslint-disable-line

			return returnMessage;
		}

		return null;
	});
}

export function setCode({ props, state }: Context<any>) {
	const currentId = state.editor.currentId;
	const moduleShortid = props.moduleShortid;
	const moduleIndex = state.editor.currentSandbox
		.get()
		.modules.findIndex((module) => module.shortid === moduleShortid);

	state.editor.sandboxes.get(currentId).modules[moduleIndex].code = props.code;
}

export function setPreviewBounds({ props, state }: Context<any>) {
	if (props.x != null) {
		state.editor.previewWindow.x = props.x;
	}
	if (props.y != null) {
		state.editor.previewWindow.y = props.y;
	}
	if (props.width != null) {
		state.editor.previewWindow.width = props.width;
	}
	if (props.height != null) {
		state.editor.previewWindow.height = props.height;
	}
}
