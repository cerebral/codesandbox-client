import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';
import { addNotification } from '../../factories';

export const changePrice = set(state`patron.price`, props`price`);

export const createSubscription = [
  actions.subscribe,
  set(state`user`, props`user`),
  addNotification('Thank you very much for your support!', 'success'),
];

export const updateSubscription = [
  actions.updateSubscription,
  set(state`user`, props`user`),
  addNotification('Subscription updated, thanks for helping out!', 'success'),
];

export const cancelSubscription = [
  actions.whenConfirmedCancelSubscription,
  {
    true: [
      actions.cancelSubscription,
      set(state`user`, props`user`),
      addNotification(
        'Sorry to see you go, but thanks a bunch for the support this far!',
        'success'
      ),
    ],
    false: [],
  },
];