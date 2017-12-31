import { Component } from "@angular/core";
import { Coord } from "./coord";
import { GameService } from "./game.service";

@Component({
    selector: "app-board",
    template: `
    <div class="board">
        <ng-container *ngIf="knightPosition$|async as kp">
            <div *ngFor="let i of sixtyFour">
                <app-square *ngIf="xy(i) as pos" [black]="isBlack(pos)" (click)="handleSquareClick(pos)">
                    <app-knight *ngIf="pos.x === kp.x && pos.y === kp.y"></app-knight>
                </app-square>
            </div>
        </ng-container>
    </div>
    `, styles: [`
    .board {
        width: 100%;
        height: 100%;
        border: 1px solid black;
        display: grid;
        grid-template-columns: repeat(8, 12.5%);
        grid-template-rows: repeat(8, 12.5%);
    }
    `]
})
export class BoardComponent {

    sixtyFour = new Array(64).fill(0).map((_, i) => i);

    knightPosition$ = this.game.knightPosition$;

    constructor(private game: GameService) {}

    xy(i) {
        return {
            x: i % 8,
            y: Math.floor(i / 8)
        }
    }

    isBlack({ x, y }: Coord) {
        return (x + y) % 2 === 1;
    }

    handleSquareClick(pos: Coord) {
        if (this.game.canMoveKnight(pos)) {
            this.game.moveKnight(pos);
        }
    }

}