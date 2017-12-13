import { types } from 'mobx-state-tree';

export default {
  jwt: types.maybe(types.string),
  authToken: types.maybe(types.string),
  error: types.maybe(types.string),
  user: types.model({
    avatarUrl: types.maybe(types.string),
    badges: types.array(
      types.model({
        id: types.string,
        name: types.string,
        visible: types.boolean,
      })
    ),
    email: types.maybe(types.string),
    id: types.maybe(types.string),
    integrations: types.model({
      github: types.maybe(types.model({})),
      zeit: types.maybe(
        types.model({
          token: types.string,
        })
      ),
    }),
    name: types.maybe(types.string),
    subscription: types.maybe(
      types.model({
        amount: types.number,
        since: types.string,
      })
    ),
    username: types.maybe(types.string),
  }),
  connected: types.boolean,
  notifications: types.array(
    types.model({
      buttons: types.array(types.string),
      endTime: types.number,
      id: types.number,
      notificationType: types.string,
      title: types.string,
    })
  ),
  isLoadingCLI: types.boolean,
  currentModal: types.maybe(types.string),
};
