import { Coord, GameService } from "./game.service";
import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "app-board",
    template: `
    <div class="board">
        <ng-container *ngIf="knightPosition$|async as kp">
            <div class="square-container" *ngFor="let i of sixtyFour; trackBy: track">
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
        grid-auto-flow: row;
        align-items: stretch;
    }
    .square-container {
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Board {
    sixtyFour = new Array(64).fill(0).map((_, i) => i);
    xy = (i): Coord => ({
        x: i % 8,
        y: Math.floor(i / 8)
    });
    isBlack = ({ x, y }: Coord) => (x + y) % 2 === 1;

    knightPosition$ = this.game.knightPosition$;
    constructor(private game: GameService) { }

    handleSquareClick(to: Coord) {
        if (this.game.canMoveKnight(to)) {
            this.game.moveKnight(to);
        }
    }

    track(_, i) {
        return i;
    }

}