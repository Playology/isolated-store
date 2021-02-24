import { createFeatureSelector, createSelector } from '@ngrx/store';

import { <%= classify(feature) %>State } from './<%= dasherize(storename) %>.reducer';

export const get<%= classify(feature) %>Feature = createFeatureSelector<<%= classify(feature) %>State>('<%= camelize(feature) %>');

export const getIsInitialised = createSelector(
  get<%= classify(feature) %>Feature,
  (state: <%= classify(feature) %>State) => state.isInitialised
);