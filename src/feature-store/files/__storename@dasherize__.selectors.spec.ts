import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { <%= classify(feature) %>State } from './<%= dasherize(storename) %>.reducer';
import { getIsInitialised } from './<%= dasherize(storename) %>.selectors';

describe('<%= classify(storename) %> Selectors', () => {
  const <%= classify(feature) %>State = {
      isInitialised: false
    };
  
  const state: any = {
    <%= camelize(feature) %>:  <%= classify(feature) %>State
  };

  let store: MockStore<<%= classify(feature) %>State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore<<%= classify(feature) %>State>({ initialState: state })]
    });

    store = TestBed.get<Store<<%= classify(feature) %>State>>(Store);
  });

  it('should provide selector to get module initialisation state', () => {
    expect(getIsInitialised(state)).toBe(state.<%= camelize(feature) %>.isInitialised);
  });
});
