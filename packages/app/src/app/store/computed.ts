import { State } from './types';

export function isPatron(state: State) {
	return Boolean(state.user && state.user.subscription && state.user.subscription.since);
}

export function isLoggedIn(state: State) {
	return Boolean(state.jwt) && Boolean(state.user);
}
