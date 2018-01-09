import * as React from 'react';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';

import BasePreview from 'app/components/Preview';
import FlyingContainer from './FlyingContainer';

class Preview extends React.Component {
  onPreviewInitialized = preview => {
    const disposeHandleProjectViewChange = reaction(
      () => this.props.store.editor.isInProjectView,
      this.handleProjectView.bind(this, preview)
    );
    const disposeHandleForcedRenders = reaction(
      () => this.props.store.editor.forceRender,
      this.handleExecuteCode.bind(this, preview)
    );
    const disposeHandleExternalResources = reaction(
      () => this.props.store.editor.currentSandbox.externalResources.length,
      this.handleExecuteCode.bind(this, preview)
    );
    const disposeHandleModuleSyncedChange = reaction(
      () => this.props.store.editor.isAllModulesSynced,
      this.handleModuleSyncedChange.bind(this, preview)
    );
    const disposeHandleCodeChange = reaction(
      () => this.props.store.editor.currentModule.code,
      this.handleCodeChange.bind(this, preview)
    );
    const disposeHandleStructureChange = reaction(
      this.detectStructureChange,
      this.handleStructureChange.bind(this, preview)
    );
    const disposeHandleSandboxChange = reaction(
      () => this.props.store.editor.currentSandbox.id,
      this.handleSandboxChange.bind(this, preview)
    );
    const disposeDependenciesHandler = reaction(
      () =>
        this.props.store.editor.currentSandbox.npmDependencies.keys().length,
      this.handleDependenciesChange.bind(this, preview)
    );

    return () => {
      disposeHandleProjectViewChange();
      disposeHandleForcedRenders();
      disposeHandleExternalResources();
      disposeHandleModuleSyncedChange();
      disposeHandleCodeChange();
      disposeHandleStructureChange();
      disposeHandleSandboxChange();
      disposeDependenciesHandler();
    };
  };

  detectStructureChange = () => {
    const sandbox = this.props.store.editor.currentSandbox;

    return String(
      sandbox.modules
        .map(module => module.directoryShortid + module.title)
        .concat(
          sandbox.directories.map(
            directory => directory.directoryShortid + directory.title
          )
        )
    );
  };

  handleSandboxChange = (preview, newId) => {
    preview.handleSandboxChange(newId);
  };

  handleDependenciesChange = preview => {
    preview.handleDependenciesChange();
  };

  handleCodeChange = preview => {
    const settings = this.props.store.preferences.settings;
    if (settings.livePreviewEnabled) {
      if (settings.instantPreviewEnabled) {
        preview.executeCodeImmediately();
      } else {
        preview.executeCode();
      }
    }
  };

  handleStructureChange = preview => {
    const settings = this.props.store.preferences.settings;
    if (settings.livePreviewEnabled) {
      if (settings.instantPreviewEnabled) {
        preview.executeCodeImmediately();
      } else {
        preview.executeCode();
      }
    }
  };

  handleModuleSyncedChange = (preview, change) => {
    if (!change.oldValue && change.newValue) {
      preview.executeCodeImmediately();
    }
  };

  handleExecuteCode = preview => {
    preview.executeCodeImmediately();
  };

  handleProjectView = preview => {
    this.forceUpdate(() => {
      preview.executeCodeImmediately();
    });
  };

  render() {
    const { store, signals, width, height } = this.props;

    return (
      <FlyingContainer>
        {({ resize }) => (
          <BasePreview
            onInitialized={this.onPreviewInitialized}
            sandbox={store.editor.currentSandbox}
            currentModule={store.editor.currentModule}
            settings={store.preferences.settings}
            initialPath={store.editor.initialPath}
            isInProjectView={store.editor.isInProjectView}
            onClearErrors={() =>
              store.editor.errors.length && signals.editor.errorsCleared()
            }
            onAction={action =>
              signals.editor.previewActionReceived({ action })
            }
            onOpenNewWindow={() =>
              this.props.signals.preferences.viewModeChanged({
                showEditor: true,
                showPreview: false,
              })
            }
            onToggleProjectView={() => signals.editor.projectViewToggled()}
            showDevtools={store.preferences.showDevtools}
            isResizing={store.editor.isResizing}
            alignRight={() =>
              resize({
                x: 0,
                y: 0,
                width: this.props.width / 2 - 32,
                height: this.props.height - 32,
              })
            }
            alignBottom={() =>
              resize({
                x: 0,
                y: this.props.height / 2 - 32,
                width: this.props.width - 32,
                height: this.props.height / 2,
              })
            }
          />
        )}
      </FlyingContainer>
    );
  }
}

export default inject('signals', 'store')(observer(Preview));
