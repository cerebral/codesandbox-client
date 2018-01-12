import { types } from 'mobx-state-tree';

export default {
  project: types.model({
    title: types.string,
    description: types.string,
  }),
  tags: types.model({
    tagName: types.string,
  }),
  isWorkspaceHidden: types.boolean,
  showSearchDependenciesModal: types.boolean,
  showDeleteSandboxModal: types.boolean,
  openedWorkspaceItem: types.string,
};