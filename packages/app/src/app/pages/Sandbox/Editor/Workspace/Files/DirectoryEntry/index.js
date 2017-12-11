import React from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import { DropTarget } from 'react-dnd';
import Alert from 'app/components/Alert';

import validateTitle from './validateTitle';
import Entry from './Entry';
import DirectoryChildren from './DirectoryChildren';

function getModuleParents(modules, directories, id) {
  const module = modules.find(moduleEntry => moduleEntry.id === id);

  if (!module) return [];

  let directory = directories.find(
    directoryEntry => directoryEntry.shortid === module.directoryShortid
  );
  let directoryIds = [];
  while (directory != null) {
    directoryIds = [...directoryIds, directory.id];
    directory = directories.find(
      directoryEntry => directoryEntry.shortid === directory.directoryShortid // eslint-disable-line
    );
  }

  return directoryIds;
}

const EntryContainer = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${props => (props.isOver ? 'block' : 'none')};
`;

const Opener = styled.div`
  height: ${props => (props.open ? '100%' : '0px')};
  overflow: hidden;
`;

class DirectoryEntry extends React.PureComponent {
  constructor(props) {
    super(props);

    const { id, modules, directories, currentModuleId } = this.props;
    const currentModuleParents = getModuleParents(
      modules,
      directories,
      currentModuleId
    );

    const isParentOfModule = currentModuleParents.includes(id);

    this.state = {
      creating: '',
      open: props.root || isParentOfModule,
    };
  }

  componentDidMount() {
    if (this.props.innerRef) {
      this.props.innerRef(this);
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (
      !nextState.open &&
      this.props.currentModuleId !== nextProps.currentModuleId
    ) {
      const { id, modules, directories, currentModuleId } = nextProps;
      const currentModuleParents = getModuleParents(
        modules,
        directories,
        currentModuleId
      );

      const isParentOfModule = currentModuleParents.includes(id);
      if (isParentOfModule) {
        this.setState({ open: isParentOfModule });
      }
    }
  }

  resetState = () => this.setState({ creating: '' });

  onCreateModuleClick = () => {
    this.setState({
      creating: 'module',
      open: true,
    });

    return true;
  };

  createModule = (_, title) => {
    const { sandboxId, shortid, sandboxActions } = this.props;
    // this.props.signals.editor.workspace.moduleCreated({ title, directoryShortid: shortid })
    sandboxActions.createModule(sandboxId, title, shortid);
    this.resetState();
  };

  renameModule = (id, title) => {
    const { sandboxId, sandboxActions } = this.props;
    // this.props.signals.editor.workspace.moduleRenamed({ id, title })
    sandboxActions.renameModule(sandboxId, id, title);
  };

  deleteModule = (id: string) => {
    const { sandboxId, modules, sandboxActions, modalActions } = this.props;
    const module = modules.find(m => m.id === id);

    this.props.signals.modalOpened({ modal: 'deleteModule' });
    modalActions.openModal({
      Body: (
        <Alert
          title="Delete File"
          body={
            <span>
              Are you sure you want to delete <b>{module.title}</b>?
              <br />
              The file will be permanently removed.
            </span>
          }
          onCancel={modalActions.closeModal}
          onDelete={() => {
            modalActions.closeModal();
            // this.props.signals.editor.workspace.moduleDeleted({ id })
            sandboxActions.deleteModule(sandboxId, id);
          }}
        />
      ),
    });
  };

  onCreateDirectoryClick = () => {
    this.setState({
      creating: 'directory',
      open: true,
    });
    return true;
  };

  createDirectory = (_: string, title: string) => {
    const { sandboxId, shortid, sandboxActions } = this.props;
    // this.props.signals.editor.workspace.directoryCreated({ title, directoryShortid: shortid })
    sandboxActions.createDirectory(sandboxId, title, shortid);
    this.resetState();
  };

  renameDirectory = (id, title) => {
    const { sandboxId, sandboxActions } = this.props;
    // this.props.signals.editor.workspace.directoryRenamed({ title, id })
    sandboxActions.renameDirectory(sandboxId, id, title);
  };

  deleteDirectory = () => {
    const { id, title, sandboxId, sandboxActions } = this.props;

    // this.props.signals.editor.workspace.directoryDeleted({ id })

    // eslint-disable-next-line no-alert
    const confirmed = confirm(
      `Are you sure you want to delete ${title} and all its children?`
    );

    if (confirmed) {
      sandboxActions.deleteDirectory(sandboxId, id);
    }
    return true;
  };

  toggleOpen = () => this.setOpen(!this.state.open);
  closeTree = () => this.setOpen(false);
  setOpen = open => this.setState({ open });

  validateModuleTitle = (_, title) => {
    const { directories, modules, id } = this.props;
    return validateTitle(id, title, [...directories, ...modules]);
  };

  validateDirectoryTitle = (id, title) => {
    const { root, siblings } = this.props;
    if (root) return false;

    return validateTitle(id, title, siblings);
  };

  getChildren = () => {
    const { modules, directories, shortid } = this.props;

    return [
      ...modules.filter(m => m.directoryShortid === shortid),
      ...directories.filter(d => d.directoryShortid === shortid),
    ];
  };

  setCurrentModule = (moduleId: string) => {
    const { sandboxId, sandboxActions } = this.props;
    this.props.signals.editor.moduleSelected({ id: moduleId });
    sandboxActions.setCurrentModule(sandboxId, moduleId);
  };

  markTabsNotDirty = () => {
    this.props.signals.editor.moduleDoubleClicked();
    this.props.sandboxActions.markTabsNotDirty(this.props.sandboxId);
  };

  render() {
    const {
      id,
      shortid,
      sandboxId,
      sandboxTemplate,
      modules,
      directories,
      title,
      openMenu,
      currentModuleId,
      connectDropTarget, // eslint-disable-line
      isOver, // eslint-disable-line
      isInProjectView,
      depth = 0,
      root,
      mainModuleId,
      errors,
      corrections,
    } = this.props;
    const { creating, open } = this.state;

    return connectDropTarget(
      <div style={{ position: 'relative' }}>
        <Overlay isOver={isOver} />
        {!root && (
          <EntryContainer>
            <Entry
              id={id}
              title={title}
              depth={depth}
              type={open ? 'directory-open' : 'directory'}
              root={root}
              isOpen={open}
              onClick={this.toggleOpen}
              renameValidator={this.validateDirectoryTitle}
              rename={!root && this.renameDirectory}
              onCreateModuleClick={this.onCreateModuleClick}
              onCreateDirectoryClick={this.onCreateDirectoryClick}
              deleteEntry={!root && this.deleteDirectory}
              hasChildren={this.getChildren().length > 0}
              openMenu={openMenu}
              closeTree={this.closeTree}
            />
          </EntryContainer>
        )}
        <Opener open={open}>
          {creating === 'directory' && (
            <Entry
              id=""
              title=""
              state="editing"
              type="directory"
              depth={depth + 1}
              renameValidator={this.validateModuleTitle}
              rename={this.createDirectory}
              onRenameCancel={this.resetState}
            />
          )}
          <DirectoryChildren
            modules={modules}
            directories={directories}
            depth={depth}
            renameModule={this.renameModule}
            openMenu={openMenu}
            sandboxId={sandboxId}
            mainModuleId={mainModuleId}
            sandboxTemplate={sandboxTemplate}
            parentShortid={shortid}
            deleteEntry={this.deleteModule}
            setCurrentModule={this.setCurrentModule}
            currentModuleId={currentModuleId}
            isInProjectView={isInProjectView}
            markTabsNotDirty={this.markTabsNotDirty}
            errors={errors}
            corrections={corrections}
          />
          {creating === 'module' && (
            <Entry
              id=""
              title=""
              state="editing"
              depth={depth + 1}
              renameValidator={this.validateModuleTitle}
              rename={this.createModule}
              onRenameCancel={this.resetState}
            />
          )}
        </Opener>
      </div>
    );
  }
}

const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return;

    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) return;

    const sourceItem = monitor.getItem();

    if (sourceItem.directory) {
      props.signals.editor.workspace.directoryMovedToDirectory({
        directoryId: sourceItem.id,
        directoryShortid: props.shortid,
      });
      props.sandboxActions.moveDirectoryToDirectory(
        props.sandboxId,
        sourceItem.id,
        props.shortid
      );
    } else {
      props.signals.editor.workspace.moduleMovedToDirectory({
        moduleId: sourceItem.id,
        directoryShortid: props.shortid,
      });
      props.sandboxActions.moveModuleToDirectory(
        props.sandboxId,
        sourceItem.id,
        props.shortid
      );
    }
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    if (source.id === props.id) return false;
    return true;
  },
};

function collectTarget(connectMonitor, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connectMonitor.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

export default inject('signals')(
  DropTarget('ENTRY', entryTarget, collectTarget)(DirectoryEntry)
);
