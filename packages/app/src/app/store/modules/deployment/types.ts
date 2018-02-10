import * as sequences from './sequences';

export type State = {
	deploying: boolean;
	url: string;
};

export type Signals = {
	deployClicked: typeof sequences.deploy;
	deploySandboxClicked: typeof sequences.openDeployModal;
};
