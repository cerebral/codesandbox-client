export function updateSandbox({ api, state }) {
  const sandboxId = state.get('editor.currentId');
  const body = {
    sandbox: {
      title: state.get('editor.workspace.project.title'),
      description: state.get('editor.workspace.project.description'),
    },
  };

  return api
    .put(`/sandboxes/${sandboxId}`, body)
    .then(data => ({ data }))
    .catch(error => ({ error }));
}

export function addTag({ api, state }) {
  const sandboxId = state.get('editor.currentId');
  const tag = state.get('editor.workspace.tags.tagName');
  const body = {
    tag,
  };
  return api
    .post(`/sandboxes/${sandboxId}/tags`, body)
    .then(data => ({ data }));
}

export function removeTag({ api, props, state }) {
  const { tag } = props;
  const sandboxId = state.get('editor.currentId');
  return api
    .delete(`/sandboxes/${sandboxId}/tags/${tag}`)
    .then(data => ({ tags: data }));
}

export function removeTagFromState({ props, state }) {
  const { tag } = props;
  const sandboxId = state.get('editor.currentId');
  const tags = state.get(`editor.sandboxes.${sandboxId}.tags`);
  const index = tags.indexOf(tag);
  state.splice(`editor.sandboxes.${sandboxId}.tags`, index, 1);
  return { tag };
}

export function addNpmDependency({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .post(`/sandboxes/${sandboxId}/dependencies`, {
      dependency: {
        name: props.name,
        version: props.version,
      },
    })
    .then(data => ({ npmDependencies: data }));
}

export function removeNpmDependency({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .delete(`/sandboxes/${sandboxId}/dependencies/${props.name}`)
    .then(data => ({ npmDependencies: data }));
}

export function addExternalResource({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .post(`/sandboxes/${sandboxId}/resources`, {
      externalResource: props.resource,
    })
    .then(data => ({ externalResources: data }));
}

export function removeExternalResource({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .request({
      method: 'DELETE',
      url: `/sandboxes/${sandboxId}/resources/`,
      body: {
        id: props.resource,
      },
    })
    .then(data => ({ externalResources: data }));
}
