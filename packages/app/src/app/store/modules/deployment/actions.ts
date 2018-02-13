import { Context, BranchContext } from 'fluent';
import getTemplate from 'common/templates';

export function createZip({ utils, state }: Context) {
	const sandboxId = state.editor.currentId;
	const sandbox = state.editor.sandboxes.get(sandboxId);

	return utils.getZip(sandbox).then((result) => ({ file: result.file }));
}

export function loadZip({ props, jsZip }: Context<{ file: any }>) {
	const { file } = props;

	return jsZip.loadAsync(file).then((result) => ({ contents: result }));
}

export async function createApiData({ props, state }: Context<{ contents: any }>) {
	const { contents } = props;
	const sandbox = state.editor.sandboxes[state.editor.currentId];
	let apiData: any = {};
	const filePaths = Object.keys(contents.files);
	for (let i = 0; i < filePaths.length; i += 1) {
		const filePath = filePaths[i];
		const file = contents.files[filePath];

		if (!file.dir) {
			apiData[filePath] = await file.async('text'); // eslint-disable-line no-await-in-loop
		}
	}

	apiData.package = JSON.parse(apiData['package.json']);
	// We force the sandbox id, so ZEIT will always group the deployments to a
	// single sandbox
	apiData.package.name = `csb-${sandbox.id}`;
	delete apiData['package.json'];

	const template = getTemplate(sandbox.template);

	if (template.alterDeploymentData) {
		apiData = template.alterDeploymentData(apiData);
	}

	return { apiData };
}

export function postToZeit({
	http,
	path,
	props,
	state
}: BranchContext<
	{
		success: { url: string };
		error: { error: string };
	},
	{ apiData: {} }
>) {
	const { apiData } = props;
	const token = state.user.integrations.zeit.token;

	return http
		.request({
			method: 'POST',
			url: 'https://api.zeit.co/now/deployments',
			body: apiData,
			headers: { Authorization: `bearer ${token}` }
		})
		.then((response) => {
			const url = `https://${response.result.host}`;
			return path.success({ url });
		})
		.catch((error) => path.error({ error }));
}
