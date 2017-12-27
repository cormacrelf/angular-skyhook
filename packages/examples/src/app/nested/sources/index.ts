import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DndModule } from 'angular-hovercraft';
import { BlueOrYellowComponent } from './blue-or-yellow.component';
import { TargetBox } from './target.component';
import { ContainerComponent } from './container.component';

@NgModule({
  declarations: [
    TargetBox, ContainerComponent, BlueOrYellowComponent
  ],
  imports: [
    CommonModule,
    DndModule,
    RouterModule.forChild([{ path: '', component: ContainerComponent }])
  ],
})
export class Module { }
