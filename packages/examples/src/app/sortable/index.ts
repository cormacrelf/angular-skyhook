

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DndModule } from 'angular-hovercraft';
import { SortedComponent } from './sorted.component';
import { CardComponent, CardInnerDirective } from './card.component';

@NgModule({
  declarations: [
      CardComponent, CardInnerDirective, SortedComponent
  ],
  imports: [
    CommonModule,
    DndModule,
    RouterModule.forChild([{ path: '', component: SortedComponent }])
  ],
})
export class Module { }
