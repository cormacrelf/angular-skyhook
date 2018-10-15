import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkyhookDndModule } from "@angular-skyhook/core";
import { GameService } from './game.service';
import { UtilityModule } from 'app/utility.module';

import { KnightComponent } from './knight.component';
import { SquareComponent } from './square.component';
import { BoardComponent } from './board.component';
import { ContainerComponent } from './container.component';
import { BoardSquareComponent } from './board-square.component';

@NgModule({
    declarations: [
        KnightComponent, SquareComponent, BoardComponent, ContainerComponent, BoardSquareComponent
    ],
    imports: [
        CommonModule,
        SkyhookDndModule,
        RouterModule.forChild([{ path: '', component: ContainerComponent }]),
        UtilityModule,
    ],
    providers: [
        GameService
    ]
})
export class ChessboardModule { }
