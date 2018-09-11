
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from "@angular-skyhook/core";

import { ContainerComponent } from './container.component';
import { TargetComponent } from './target.component';
import { UtilityModule } from '../../utility.module';

@NgModule({
  declarations: [
    ContainerComponent,
    TargetComponent,
  ],
  imports: [
    CommonModule,
    SkyhookDndModule,
    RouterModule.forChild([{ path: '', component: ContainerComponent }]),
    UtilityModule
  ],
})
export class NativeTypesModule { }

