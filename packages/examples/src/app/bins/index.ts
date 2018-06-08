import { Bin } from './bin.component';
import { TrashPile } from './trash-pile.component';
import { Trash } from './trash.component';
import { Container } from './container.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from 'angular-skyhook';
import { MultiBackendPreviewModule } from '../angular-skyhook-multi-backend';
import { UtilityModule } from '../utility.module';

@NgModule({
  declarations: [
    Bin, TrashPile, Trash, Container
  ],
  imports: [
    CommonModule,
    SkyhookDndModule,
    RouterModule.forChild([{ path: '', component: Container }]),
    MultiBackendPreviewModule,
    UtilityModule
  ],
})
export class Module { }

