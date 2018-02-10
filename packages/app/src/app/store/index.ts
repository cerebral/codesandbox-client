import { Module, Computed } from '@cerebral/fluent';
import { State, Signals } from './types';
import * as computed from './computed';
import * as providers from './providers/index';
import * as sequences from './sequences';
import * as errors from './errors';

import patron from './modules/patron';
import editor from './modules/editor';
import profile from './modules/profile';
import deployment from './modules/deployment';
import git from './modules/git';
import preferences from './modules/preferences';
import workspace from './modules/workspace';
import files from './modules/files';

const state: State = {
	hasLoadedApp: false,
	jwt: null,
	isAuthenticating: true,
	authToken: null,
	error: null,
	user: null,
	connected: true,
	notifications: [],
	userMenuOpen: false,
	isLoadingZeit: false,
	isLoadingCLI: false,
	isLoadingGithub: false,
	contextMenu: {
		show: false,
		items: [],
		x: 0,
		y: 0
	},
	currentModal: null,
	isPatron: Computed(computed.isPatron),
	isLoggedIn: Computed(computed.isLoggedIn)
};

const signals: Signals = {
	appUnmounted: sequences.unloadApp,
	searchMounted: sequences.loadSearch,
	termsMounted: sequences.loadTerms,
	connectionChanged: sequences.setConnection,
	modalOpened: sequences.openModal,
	modalClosed: sequences.closeModal,
	signInClicked: sequences.signIn,
	userMenuOpened: sequences.openUserMenu,
	userMenuClosed: sequences.closeUserMenu,
	notificationAdded: sequences.addNotification,
	notificationRemoved: sequences.removeNotification,
	signInZeitClicked: sequences.signInZeit,
	signOutZeitClicked: sequences.signOutZeit,
	authTokenRequested: sequences.getAuthToken,
	requestAuthorisation: sequences.authorize,
	signInGithubClicked: sequences.signInGithub,
	signOutClicked: sequences.signOut,
	signOutGithubIntegration: sequences.signOutGithubIntegration
};

export default Module({
	state,
	signals,
	catch: [ [ errors.AuthenticationError, sequences.showAuthenticationError ] ],
	modules: {
		patron,
		editor,
		profile,
		deployment,
		git,
		preferences,
		workspace,
		files
	},
	providers
});
