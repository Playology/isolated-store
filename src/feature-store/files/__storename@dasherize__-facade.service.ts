import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { <%= classify(feature) %>State } from './<%= dasherize(storename) %>.reducer';
import { getIsInitialised } from './<%= dasherize(storename) %>.selectors';

export interface I<%= classify(storename) %>Facade {
  isInitialised(): Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class <%= classify(storename) %>Facade implements I<%= classify(storename) %>Facade {
  constructor(private store: Store<<%= classify(feature) %>State>) {}

  public get isInitialised$(): Observable<boolean> {
    return this.store.pipe(select(getIsInitialised));
  }
}
