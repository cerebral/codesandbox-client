// @flow
import * as React from 'react';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';

import BasePreview from 'app/components/Preview';
import FlyingContainer from './FlyingContainer';

type Props = {
  width: ?number,
  height: ?number,
  store: any,
  signals: any,
};

class Preview extends React.Component<Props> {
  onPreviewInitialized = preview => {
    let preventCodeExecution = false;
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
      () => {
        if (preventCodeExecution) {
          preventCodeExecution = false;
          return;
        }
        this.handleCodeChange(preview);
      }
    );
    const disposeHandleModuleChange = reaction(
      () => this.props.store.editor.currentModule,
      () => {
        if (this.props.store.editor.isInProjectView) {
          preventCodeExecution = true;
        }
      }
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
      disposeHandleModuleChange();
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

  componentWillReceiveProps(props: Props) {
    const { width, height } = props;
    if (width && height) {
      let newWidth = props.store.editor.previewWindow.width;
      if (
        width !== this.props.width &&
        width - 16 <
          props.store.editor.previewWindow.width -
            props.store.editor.previewWindow.x
      ) {
        newWidth = Math.max(
          64,
          width - 16 + props.store.editor.previewWindow.x
        );
      }

      let newHeight = props.store.editor.previewWindow.height;
      if (
        height !== this.props.height &&
        height - 16 <
          props.store.editor.previewWindow.height +
            props.store.editor.previewWindow.y
      ) {
        newHeight = Math.max(
          64,
          height - 16 - props.store.editor.previewWindow.y
        );
      }

      props.signals.editor.setPreviewBounds({
        width: newWidth,
        height: newHeight,
      });
    }
  }

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
    if (change) {
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
    const { store, signals } = this.props;

    const packageJSON = {
      path: '/package.json',
      code: store.editor.currentPackageJSONCode,
    };

    return (
      <FlyingContainer>
        {({ resize }) => (
          <BasePreview
            onInitialized={this.onPreviewInitialized}
            sandbox={store.editor.currentSandbox}
            extraModules={{ '/package.json': packageJSON }}
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
                width: (this.props.width || 0) / 2,
                height: (this.props.height || 0) - 16,
              })
            }
            alignBottom={() =>
              resize({
                x: 0,
                y: (this.props.height || 0) / 2 - 16,
                width: (this.props.width || 0) - 16,
                height: (this.props.height || 0) / 2,
              })
            }
          />
        )}
      </FlyingContainer>
    );
  }
}

export default inject('signals', 'store')(observer(Preview));
