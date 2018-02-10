import { sequence, sequenceWithProps } from 'fluent';
import { addNotification } from '../../factories';
import * as actions from './actions';
import { getZeitUserDetails } from '../../sequences';

export const openDeployModal = sequence((s) =>
	s
		.action('setDeploymentModal', ({ state }) => {
			state.currentModal = 'deployment';
		})
		.sequence(getZeitUserDetails)
);

export const deploy = sequence((s) =>
	s
		.action('setDeploying', ({ state }) => {
			state.deployment.deploying = true;
		})
		.action(actions.createZip)
		.action(actions.loadZip)
		.action(actions.createApiData)
		.branch(actions.postToZeit)
		.paths({
			success: (s) =>
				s.action(({ state, props }) => {
					state.deployment.url = props.url;
					state.deployment.deploying = false;
				}),
			error: (s) => s.action(addNotification('An unknown error occured when connecting to ZEIT', 'error'))
		})
);
