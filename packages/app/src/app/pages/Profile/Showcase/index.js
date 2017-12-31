import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Column from 'common/components/flex/Column';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import Button from 'app/components/Button';
import Modal from 'app/components/Modal';

import SandboxInfo from './SandboxInfo';
import ShowcasePreview from './ShowcasePreview';
import SelectSandbox from './SelectSandbox';

import { ErrorTitle } from './elements';

class Showcase extends React.Component {
  openModal = () => {
    this.props.signals.profile.selectSandboxClicked();
  };

  render() {
    const { store, signals } = this.props;
    const sandbox = store.profile.showcasedSandbox;
    const isCurrentUser = store.profile.isProfileCurrentUser;

    if (store.profile.isLoadingProfile) {
      return (
        <Centered vertical horizontal>
          <Margin top={4}>
            <ErrorTitle>Loading showcased sandbox...</ErrorTitle>
          </Margin>
        </Centered>
      );
    }

    if (!sandbox) {
      return (
        <Centered vertical horizontal>
          <Margin top={4}>
            <ErrorTitle>This user doesn{"'"}t have a sandbox yet</ErrorTitle>
          </Margin>
        </Centered>
      );
    }

    return (
      <Column alignItems="center">
        <Margin top={1}>
          {isCurrentUser && (
            <Button small onClick={this.openModal}>
              Change Sandbox
            </Button>
          )}
        </Margin>
        <Margin top={2} style={{ width: '100%' }}>
          <Column alignItems="initial">
            <div style={{ flex: 2 }}>
              <ShowcasePreview
                sandbox={sandbox}
                settings={this.props.store.preferences.settings}
              />
            </div>
            <div style={{ flex: 1 }}>
              <SandboxInfo sandbox={sandbox} />
            </div>
          </Column>
        </Margin>
        <Modal
          isOpen={store.profile.showSelectSandboxModal}
          onClose={() => signals.profile.selectSandboxClosed()}
          width={600}
        >
          <SelectSandbox />
        </Modal>
      </Column>
    );
  }
}

export default inject('signals', 'store')(observer(Showcase));
