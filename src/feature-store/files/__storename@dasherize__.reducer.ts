import { Action, createReducer, on } from '@ngrx/store';
import { initialiseModuleSucceeded } from './<%= dasherize(storename) %>.actions';

export interface <%= classify(feature) %>State {
    isInitialised: boolean;
}

export const initial<%= classify(feature) %>State: <%= classify(feature) %>State = {
    isInitialised: false
};

const reducer =  createReducer(initial<%= classify(feature) %>State,
    on(initialiseModuleSucceeded, (state) => ({
        ...state,
        isInitialised: true
    }))
);

export const <%= camelize(storename) %>Reducer = (state: <%= classify(feature) %>State | undefined, action: Action): <%= classify(feature) %>State => reducer(state, action);