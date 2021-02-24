import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';
import { StoreModule } from '@ngrx/store';

import { initialiseModule, initialiseModuleSucceeded } from './<%= dasherize(storename) %>.actions';

import { <%= classify(storename) %>Effects } from './<%= dasherize(storename) %>.effects';

describe(' <%= classify(storename) %>', () => {
  let actions$: ReplaySubject<any>;
  let effects: <%= classify(storename) %>Effects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictActionImmutability: true,
              strictActionSerializability: true,
              strictStateImmutability: true,
              strictStateSerializability: true
            }
          }
        )
      ],
      providers: [<%= classify(storename) %>Effects, provideMockActions(() => actions$)]
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.get(<%= classify(storename) %>Effects);
  });

  it('should compile', () => {
    expect(effects).toBeTruthy();
  });

  it('should return action to indicate intialisation succeeded', () => {
    const action = initialiseModule();
    const completion = initialiseModuleSucceeded();
    actions$.next(action);

    effects.initialiseModule$.subscribe(result => {
      expect(result).toEqual(completion);
    });
  });
});
