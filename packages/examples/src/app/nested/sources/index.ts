import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from 'angular-skyhook';
import { BlueOrYellowComponent } from './blue-or-yellow.component';
import { TargetBox } from './target.component';
import { ContainerComponent } from './container.component';
import { UtilityModule } from '../../utility.module';

@NgModule({
  declarations: [
    TargetBox, ContainerComponent, BlueOrYellowComponent
  ],
  imports: [
    CommonModule,
    SkyhookDndModule,
    RouterModule.forChild([{ path: '', component: ContainerComponent }]),
    UtilityModule
  ],
})
export class Module { }
