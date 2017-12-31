import { Component } from "@angular/core";
import { Coord } from "./coord";

@Component({
    selector: "app-board",
    template: `
    <div class="board">
        <div *ngFor="let i of sixtyFour">
            <app-square *ngIf="xy(i) as pos" [black]="isBlack(pos)">
                <app-knight *ngIf="pos.x === 0 && pos.y === 0"></app-knight>
            </app-square>
        </div>
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

    xy(i) {
        return {
            x: i % 8,
            y: Math.floor(i / 8)
        }
    }

    isBlack({ x, y }: Coord) {
        return (x + y) % 2 === 1;
    }

}