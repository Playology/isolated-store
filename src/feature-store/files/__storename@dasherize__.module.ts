import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { <%= camelize(storename) %>Reducer } from './<%= dasherize(storename) %>.reducer';
import { <%= classify(storename) %>Effects } from './<%= dasherize(storename) %>.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('<%= feature %>', <%= camelize(storename) %>Reducer),
    EffectsModule.forFeature([<%= classify(storename) %>Effects])
  ]
})
export class <%= classify(storename) %>Module {}
