import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { <%= classify(storename) %>Facade } from './<%= dasherize(storename) %>-facade.service';
import { <%= classify(feature) %>State } from './<%= dasherize(storename) %>.reducer';

describe('<%= classify(storename) %>Facade', () => {
  const <%= camelize(feature) %>State: <%= classify(feature) %>State = {
    isInitialised: false
      // TODO: populate feature state for testing
  };

  const initialState: any = {
    <%= camelize(feature) %>: <%= camelize(feature) %>State
  };

  let service: <%= classify(storename) %>Facade;
  let store: MockStore<<%= classify(feature) %>State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore<<%= classify(feature) %>State>({ initialState })]
    });

    service = TestBed.get(<%= classify(storename) %>Facade);
    store = TestBed.get<Store<<%= classify(feature) %>State>>(Store);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should indicate whether initialised', () => {
    service.isInitialised().subscribe(n => 
      expect(n).toEqual(<%= camelize(feature) %>State.isInitialised)
      );
  });
});
