

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from 'angular-skyhook';
import { SortedComponent } from './sorted.component';
import { CardComponent, CardInnerDirective } from './card.component';
import { UtilityModule } from '../utility.module';

@NgModule({
  declarations: [
      CardComponent, CardInnerDirective, SortedComponent
  ],
  imports: [
    CommonModule,
    SkyhookDndModule,
    RouterModule.forChild([{ path: '', component: SortedComponent }]),
    UtilityModule
  ],
})
export class Module { }
