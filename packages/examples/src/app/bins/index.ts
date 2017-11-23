import { Bin } from './bin.component';
import { Trash } from './trash.component';
import { Container } from './container.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DndModule } from 'angular-hovercraft';

@NgModule({
  declarations: [
    Bin, Trash, Container
  ],
  imports: [
    CommonModule,
    DndModule,
    RouterModule.forChild([{ path: '', component: Container }])
  ],
})
export class Module { }

