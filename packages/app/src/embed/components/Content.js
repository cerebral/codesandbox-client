import * as React from 'react';
import styled from 'styled-components';
import BasePreview from 'app/components/Preview';
import CodeEditor from 'app/components/CodeEditor';
import Tab from 'app/pages/Sandbox/Editor/Content/Tabs/Tab';

import Fullscreen from 'common/components/flex/Fullscreen';
import Centered from 'common/components/flex/Centered';
import theme from 'common/theme';

import playSVG from './play.svg';

const Container = styled.div`
  display: flex;
  position: relative;
  background-color: ${props => props.theme.background2};
  height: calc(100% - 2.5rem);
`;

const Tabs = styled.div`
  display: flex;
  height: 2.5rem;
  min-height: 2.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  overflow-x: auto;

  -ms-overflow-style: none; // IE 10+
  overflow: -moz-scrollbars-none; // Firefox

  &::-webkit-scrollbar {
    height: 2px; // Safari and Chrome
  }
`;

const Split = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${props => (props.show ? `${props.size}%` : '0px')};
  max-width: ${props => (props.only ? '100%' : `${props.size}%`)};
  min-width: ${props => (props.only ? '100%' : `${props.size}%`)};
  height: 100%;
`;

export default class Content extends React.PureComponent {
  constructor(props) {
    super(props);

    let tabs = [];

    // Show all tabs if there are not many files
    if (props.sandbox.modules.length <= 5) {
      tabs = [...props.sandbox.modules];
    } else {
      tabs = [props.sandbox.modules.find(m => m.id === props.currentModule.id)];
    }

    this.state = {
      inInProjectView: false,
      codes: {},
      errors: [],
      running: !props.runOnClick,
      tabs,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentModule !== nextProps.currentModule) {
      if (!this.state.tabs.some(x => x.id === nextProps.currentModule.id)) {
        this.setState({
          tabs: [
            ...this.state.tabs,
            nextProps.sandbox.modules.find(
              m => m.id === nextProps.currentModule.id
            ),
          ],
        });
      }
      this.editor.changeModule(nextProps.currentModule);
    }
  }

  componentDidMount() {
    setTimeout(() => this.handleResize());
  }

  setProjectView = (id: string, view: boolean) => {
    this.setState({ isInProjectView: view });
  };

  handleResize = (height: number = 500) => {
    const extraOffset = (this.props.hideNavigation ? 3 * 16 : 6 * 16) + 16;
    if (this.props.autoResize) {
      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: Math.max(height + extraOffset, 50), // pixels
        }),
        '*'
      );
    } else if (this.props.showEditor && !this.props.showPreview) {
      // If there is a focus on the editor, make it full height
      const editor = document.getElementsByClassName('CodeMirror-sizer')[0];
      const editorHeight = editor ? editor.getBoundingClientRect().height : 500;

      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: Math.max(editorHeight + extraOffset, 50), // pixels
        }),
        '*'
      );
    } else {
      window.parent.postMessage(
        JSON.stringify({
          src: window.location.toString(),
          context: 'iframe.resize',
          height: 500, // pixels
        }),
        '*'
      );
    }
  };

  setCode = (code: string) => {
    this.props.currentModule.code = code;
    const settings = this.getPreferences();

    if (settings.livePreviewEnabled) {
      if (settings.instantPreviewEnabled) {
        this.preview.executeCodeImmediately();
      } else {
        this.preview.executeCode();
      }
    }
  };

  addError = (moduleId, error) => {
    if (!this.state.errors.find(e => e.moduleId === error.moduleId)) {
      this.setState({
        errors: [...this.state.errors, error],
      });
    }
  };

  clearErrors = () => {
    if (this.state.errors.length > 0) {
      this.setState({
        errors: [],
      });
    }
  };

  preferences = {
    livePreviewEnabled: true,
  };

  getPreferences = () => ({
    ...this.preferences,
    forceRefresh: this.props.forceRefresh,
    instantPreviewEnabled: !this.props.forceRefresh,
    fontSize: this.props.fontSize,
    autoDownloadTypes: true,
    lintEnabled: this.props.enableEslint,
    codeMirror: this.props.useCodeMirror,
    lineHeight: 1.4,
  });

  setCurrentModule = (_: any, moduleId: string) => {
    this.props.setCurrentModule(moduleId);
  };

  closeTab = (pos: number) => {
    const newModule =
      this.state.tabs[pos - 1] ||
      this.state.tabs[pos + 1] ||
      this.state.tabs[0];
    this.props.setCurrentModule(newModule.id);
    this.setState({ tabs: this.state.tabs.filter((_, i) => i !== pos) });
  };

  onCodeEditorInitialized = editor => {
    this.editor = editor;
    return () => {};
  };

  onPreviewInitialized = preview => {
    this.preview = preview;
    return () => {};
  };
  RunOnClick = () => (
    <Fullscreen
      style={{ backgroundColor: theme.primary(), cursor: 'pointer' }}
      onClick={() => this.setState({ running: true })}
    >
      <Centered horizontal vertical>
        <img width={170} height={170} src={playSVG} alt="Run Sandbox" />
        <div
          style={{
            color: theme.red(),
            fontSize: '2rem',
            fontWeight: 700,
            marginTop: 24,
            textTransform: 'uppercase',
          }}
        >
          Click to run
        </div>
      </Centered>
    </Fullscreen>
  );

  render() {
    const {
      sandbox,
      showEditor,
      showPreview,
      isInProjectView,
      currentModule,
      hideNavigation,
      editorSize,
      highlightedLines,
      expandDevTools,
    } = this.props;

    const { errors } = this.state;

    // $FlowIssue
    const mainModule = currentModule;

    if (!mainModule) throw new Error('Cannot find main module');

    const { RunOnClick } = this;

    return (
      <Container>
        {showEditor && (
          <Split
            show={showEditor}
            only={showEditor && !showPreview}
            size={editorSize}
          >
            <Tabs>
              {this.state.tabs.map((module, i) => {
                const tabsWithSameName = this.state.tabs.filter(
                  m => m.title === module.title
                );
                let dirName = null;

                if (tabsWithSameName.length > 1 && module.directoryShortid) {
                  dirName = sandbox.directories.find(
                    d => d.shortid === module.directoryShortid
                  ).title;
                }

                return (
                  <Tab
                    key={module.id}
                    active={module.id === currentModule.id}
                    module={module}
                    onClick={() => this.setCurrentModule(null, module.id)}
                    tabCount={this.state.tabs.length}
                    position={i}
                    closeTab={this.closeTab}
                    dirName={dirName}
                  />
                );
              })}
            </Tabs>

            <CodeEditor
              onInitialized={this.onCodeEditorInitialized}
              currentModule={currentModule || mainModule}
              sandbox={sandbox}
              settings={this.getPreferences()}
              dependencies={sandbox.npmDependencies}
              canSave={false}
              hideNavigation={hideNavigation}
              onChange={this.setCode}
              onModuleChange={this.setCurrentModule}
            />
            {/*
              code={alteredMainModule.code}
              id={alteredMainModule.id}
              title={alteredMainModule.title}
              modulePath={getModulePath(
                alteredModules,
                sandbox.directories,
                alteredMainModule.id
              )}
              changeCode={this.setCode}
              preferences={this.getPreferences()}
              modules={sandbox.modules}
              directories={sandbox.directories}
              sandboxId={sandbox.id}
              setCurrentModule={this.setCurrentModule}
              template={sandbox.template}
              dependencies={sandbox.npmDependencies}
              hideNavigation={hideNavigation}
              canSave={false}
              corrections={[]}
              highlightedLines={highlightedLines}
              */}
          </Split>
        )}

        {showPreview && (
          <Split
            show={showPreview}
            only={showPreview && !showEditor}
            size={100 - editorSize}
          >
            {!this.state.running ? (
              <RunOnClick />
            ) : (
              <BasePreview
                onInitialized={this.onPreviewInitialized}
                sandbox={sandbox}
                currentModule={mainModule}
                settings={this.getPreferences()}
                initialPath={this.props.initialPath}
                isInProjectView={isInProjectView}
                onClearErrors={() => {}} // store.editor.errors.length && signals.editor.errorsCleared()}
                onAction={action => {}} // signals.editor.previewActionReceived({ action })}
                onOpenNewWindow={() => {}}
                /*
                  this.props.signals.editor.preferences.viewModeChanged({
                    showEditor: true,
                    showPreview: false,
                  })
                }
                */
                showDevtools={expandDevTools}
              />
            )}
            {/*
            {!this.state.running ? (
              <RunOnClick />
            ) : (
              <Preview
                sandboxId={sandbox.id}
                template={sandbox.template}
                isInProjectView={isInProjectView}
                modules={alteredModules}
                directories={sandbox.directories}
                externalResources={sandbox.externalResources}
                module={alteredMainModule}
                addError={this.addError}
                clearErrors={this.clearErrors}
                preferences={this.getPreferences()}
                setProjectView={this.props.setProjectView}
                hideNavigation={hideNavigation}
                setFrameHeight={this.handleResize}
                initialPath={this.props.initialPath}
                errors={errors}
                corrections={[]}
                dependencies={sandbox.npmDependencies}
                shouldExpandDevTools={expandDevTools}
                entry={sandbox.entry}
              />
              */}
          </Split>
        )}
      </Container>
    );
  }
}
