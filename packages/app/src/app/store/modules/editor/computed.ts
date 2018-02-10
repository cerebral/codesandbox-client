import { resolveModule } from 'common/sandbox/modules';
import getDefinition from 'common/templates';
import { generateFileFromSandbox } from 'common/templates/configuration/package-json';
import parseConfigurations from 'common/templates/configuration/parse';
import { State } from './types';

export function currentSandbox(state: State) {
	return state.sandboxes.get(state.currentId);
}

export function isAllModulesSynced(state: State) {
	return !state.changedModuleShortids.length;
}

export function currentModule(state: State) {
	return state.currentSandbox.get().modules.find((module) => module.shortid === state.currentModuleShortid);
}

// Will be used in the future
// export function normalizedModules(state: State) {
//   const sandbox = state.currentSandbox;

//   const modulesObject = {};

//   sandbox.modules.forEach(m => {
//     const path = getModulePath(sandbox.modules, sandbox.directories, m.id);
//     modulesObject[path] = {
//       path,
//       code: m.code,
//     };
//   });

//   return modulesObject;
// }

const resolveModuleWrapped = (sandbox) => (path: string) => {
	try {
		return resolveModule(path, sandbox.modules, sandbox.directories);
	} catch (e) {
		return undefined;
	}
};

export function parsedConfigurations(state: State) {
	const sandbox = state.currentSandbox.get();
	const templateDefinition = getDefinition(sandbox.template);

	return parseConfigurations(
		sandbox.template,
		templateDefinition.configurationFiles,
		resolveModuleWrapped(sandbox),
		sandbox
	);
}

export function mainModule(state: State) {
	const sandbox = state.currentSandbox.get();
	const templateDefinition = getDefinition(sandbox.template);

	const resolve = resolveModuleWrapped(sandbox);

	try {
		const nPath = templateDefinition.getEntries(state.parsedConfigurations).find((p) => resolve(p));

		return resolveModule(nPath, state.currentSandbox.get().modules, state.currentSandbox.get().directories);
	} catch (e) {
		return state.currentSandbox.get().modules.find((module) => module.shortid === state.mainModuleShortid);
	}
}

export function currentPackageJSON(state: State) {
	const module = state.currentSandbox
		.get()
		.modules.find((m) => m.directoryShortid == null && m.title === 'package.json');

	return module;
}

export function currentPackageJSONCode(state: State) {
	return state.currentPackageJSON.get()
		? state.currentPackageJSON.get().code
		: generateFileFromSandbox(state.currentSandbox);
}
