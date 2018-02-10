import { Module } from 'cerebral';
import * as sequences from './sequences';
import { State, Signals } from './types';

const state: State = {
	deploying: false,
	url: null
};

const signals: Signals = {
	deployClicked: sequences.deploy,
	deploySandboxClicked: sequences.openDeployModal
};

export default Module({
	state,
	signals
});
