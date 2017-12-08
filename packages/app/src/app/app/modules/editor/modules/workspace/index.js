import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    isWorkspaceHidden: false,
    isProcessingNpmDependencies: false,
  },
  signals: {
    workspaceToggled: sequences.toggleWorkspace,
    npmDependencyAdded: sequences.addNpmDependency,
  },
});
