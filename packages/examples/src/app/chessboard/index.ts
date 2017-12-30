import { Knight } from './knight.component';
import { Square } from './square.component';
import { Board } from './board.component';
import { Container } from './container.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DndModule } from 'angular-hovercraft';
import { GameService } from './game.service';

@NgModule({
  declarations: [
    Knight, Square, Board, Container
  ],
  imports: [
    CommonModule,
    DndModule,
    RouterModule.forChild([{ path: '', component: Container }])
  ],
  providers: [
      GameService
  ]
})
export class Module { }
