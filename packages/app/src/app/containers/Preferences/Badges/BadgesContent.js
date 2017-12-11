/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { CurrentUser, Badge as BadgeT } from 'common/types';

import userActionCreators from 'app/store/user/actions';
import { currentUserSelector } from 'app/store/user/selectors';
import Margin from 'common/components/spacing/Margin';
import Badge from 'common/utils/badges/Badge';

import { inject, observer } from 'mobx-react';

export default inject('store', 'signals')(
  observer(({ store, signals }) => {
    const badgesCount = store.user.badges.length;

    return (
      <div>
        <strong>
          You currently have {badgesCount} badge{badgesCount === 1 ? '' : 's'}.
          You can click on the badges to toggle visibility.
        </strong>
        <Margin top={2}>
          {store.user.badges.map(b => (
            <Badge
              tooltip={false}
              onClick={signals.editor.preferences.badgeVisibilityChanged}
              badge={b}
              size={128}
            />
          ))}
        </Margin>
      </div>
    );
  })
);
