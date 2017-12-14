import * as errors from './errors';
import { signInUrl, signInZeitUrl } from 'common/utils/url-generator';

export function removeNotification({ state, props }) {
  const notifications = state.get('notifications');
  const notificationToRemoveIndex = notifications.findIndex(
    notification => notification.id === props.id
  );

  state.splice('notifications', notificationToRemoveIndex, 1);
}

export function getUser({ api }) {
  return api
    .get('/users/current')
    .then(data => ({ user: data }))
    .catch(error => {
      throw new errors.AuthenticationError(
        error.response.result.errors.join(',')
      );
    });
}

export function setJwtFromStorage({ jwt, state }) {
  state.set('jwt', jwt.get() || null);
}

export function listenToConnectionChange({ connection }) {
  connection.addListener('connectionChanged');
}

export function stopListeningToConnectionChange({ connection }) {
  connection.removeListener('connectionChanged');
}

export function setPatronPrice({ props, state }) {
  state.set(
    'patron.price',
    props.user.subscription ? props.user.subscription.amount : 10
  );
}

export function getAuthToken({ api, path }) {
  return api
    .get('/auth/auth-token')
    .then(token => path.success({ token }))
    .catch(error => path.error({ error }));
}

export function siginInGithub({ browser, path, props }) {
  const { useExtraScopes } = props;
  const popup = browser.openPopup(signInUrl(useExtraScopes), 'sign in');
  browser.addEventListener('message', function onMessage(e) {
    if (event.data.type === 'signin') {
      const jwt = e.data.data.jwt;
      window.removeEventListener('message', this);
      popup.close();
      if (jwt) {
        return path.success({ jwt });
      }
      return path.error();
    }
  });
}

export function signOutGithub({ api }) {
  return api.delete(`/users/current_user/integrations/github`);
}
