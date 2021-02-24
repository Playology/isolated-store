import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { <%= camelize(name) %>Reducer, metaReducers } from './<%= dasherize(name) %>.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(<%= camelize(name) %>Reducer, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([])
  ]
})
export class <%= classify(name) %>Module {}
