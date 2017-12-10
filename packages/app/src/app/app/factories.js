/* eslint no-shadow: 0 */

export const addNotification = (
  title,
  notificationType,
  timeAlive = 2,
  buttons = []
) =>
  function addNotification({ state, resolve }) {
    const now = Date.now();

    state.push('notifications', {
      id: now,
      title: resolve.value(title),
      notificationType: resolve.value(notificationType),
      buttons: resolve.value(buttons),
      endTime: now + timeAlive * 1000,
    });
  };

export const updateSandboxUrl = sandbox =>
  function updateSandboxUrl({ router, resolve }) {
    router.updateSandboxUrl(resolve.value(sandbox));
  };
