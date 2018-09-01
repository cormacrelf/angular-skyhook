import { Box } from './box.component';
import { Dustbin } from './dustbin.component';
import { Container } from './container.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from 'angular-skyhook';
import { UtilityModule } from 'app/utility.module';
@NgModule({
  declarations: [
    Box, Dustbin, Container
  ],
  imports: [
    CommonModule,
    SkyhookDndModule,
    RouterModule.forChild([{ path: '', component: Container }]),
    UtilityModule
  ],
})
export class Module { }

