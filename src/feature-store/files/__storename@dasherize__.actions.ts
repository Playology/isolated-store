import { createAction, props } from '@ngrx/store';

export enum <%= classify(storename) %>ActionTypes {
    InitialiseModule = '[<%= classify(feature) %>] Initialise module',
    InitialiseModuleSucceeded = '[<%= classify(feature) %>] Initialise module succeeded'
}

export const initialiseModule = createAction(<%= classify(storename) %>ActionTypes.InitialiseModule);

export const  initialiseModuleSucceeded = createAction(<%= classify(storename) %>ActionTypes.InitialiseModuleSucceeded);
