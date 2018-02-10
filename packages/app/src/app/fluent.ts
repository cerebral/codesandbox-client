import { IContext, IBranchContext, SequenceFactory, SequenceWithPropsFactory, ConnectFactory } from '@cerebral/fluent';
import { State as StoreState, Signals as StoreSignals } from './store/types';
import { State as DeploymentState, Signals as DeploymentSignals } from './store/modules/deployment/types';
import { State as EditorState, Signals as EditorSignals } from './store/modules/editor/types';

type Providers = {
	api: any;
	utils: any;
	jsZip: any;
	http: any;
	browser: any;
};

type State = StoreState & {
	deployment: DeploymentState;
	editor: EditorState;
};

type Signals = StoreSignals & {
	deployment: DeploymentSignals;
	editor: EditorSignals;
};

export interface Context<Props = {}> extends IContext<Props>, Providers {
	state: State;
}

export interface BranchContext<Paths, Props = {}> extends IBranchContext<Paths, Props>, Providers {
	state: State;
}

export const connect = ConnectFactory<State, Signals>();

export const sequence = SequenceFactory<Context>();

export const sequenceWithProps = SequenceWithPropsFactory<Context>();
