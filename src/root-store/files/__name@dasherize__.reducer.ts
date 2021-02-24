import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

export interface <%= classify(name) %>State {}

export const <%= camelize(name) %>Reducer: ActionReducerMap<<%= classify(name) %>State> = {};

export const metaReducers: MetaReducer<<%= classify(name) %>State>[] = !environment.production ? [] : [];
