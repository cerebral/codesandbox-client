import { ComputedValue } from '@cerebral/fluent';
import * as sequences from './sequences';

type Badge = {
	id: string;
	name: string;
	visible: boolean;
};

type Notification = {
	buttons: string[];
	endTime: number;
	id: number;
	notificationType: string;
	title: string;
};

export type Sandbox = {};

export type State = {
	hasLoadedApp: boolean;
	jwt: string;
	isAuthenticating: boolean;
	userMenuOpen: boolean;
	authToken: string;
	error: string;
	user: {
		avatarUrl: string;
		badges: Badge[];
		email: string;
		id: string;
		integrations: {
			github: {
				email: string;
			};
			zeit: {
				email: string;
				token: string;
			};
		};
		name: string;
		subscription: {
			amount: number;
			since: string;
		};
		username: string;
	};
	connected: boolean;
	notifications: Notification[];
	isLoadingCLI: boolean;
	isLoadingGithub: boolean;
	isLoadingZeit: boolean;
	contextMenu: {
		show: boolean;
		items: string[];
		x: number;
		y: number;
	};
	currentModal: string;
	isPatron: ComputedValue<boolean>;
	isLoggedIn: ComputedValue<boolean>;
};

export type Signals = {
	appUnmounted: typeof sequences.unloadApp;
	searchMounted: typeof sequences.loadSearch;
	termsMounted: typeof sequences.loadTerms;
	connectionChanged: typeof sequences.setConnection;
	modalOpened: typeof sequences.openModal;
	modalClosed: typeof sequences.closeModal;
	signInClicked: typeof sequences.signIn;
	userMenuOpened: typeof sequences.openUserMenu;
	userMenuClosed: typeof sequences.closeUserMenu;
	notificationAdded: typeof sequences.addNotification;
	notificationRemoved: typeof sequences.removeNotification;
	signInZeitClicked: typeof sequences.signInZeit;
	signOutZeitClicked: typeof sequences.signOutZeit;
	authTokenRequested: typeof sequences.getAuthToken;
	requestAuthorisation: typeof sequences.authorize;
	signInGithubClicked: typeof sequences.signInGithub;
	signOutClicked: typeof sequences.signOut;
	signOutGithubIntegration: typeof sequences.signOutGithubIntegration;
};
