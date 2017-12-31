import { Component, Input  } from "@angular/core";
import { Coord } from './coord';
import { GameService } from "./game.service";
import { SkyhookDndService } from 'angular-skyhook';
import { ItemTypes } from "./constants";

@Component({
    selector: 'app-board-square',
    template: `
    <div class="wrapper" [dropTarget]="target">
        <app-square [black]="black">
            <ng-content></ng-content>
        </app-square>
    </div>
    `, styles: [`
    :host, .wrapper {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
    }
    `]
})
export class BoardSquareComponent {

    @Input() position: Coord;

    get black() {
         const { x, y } = this.position;
         return (x + y) % 2 === 1;
    }

    // This is the core of the dragging logic!
    target = this.dnd.dropTarget(ItemTypes.KNIGHT, {
        canDrop: monitor => {
            return this.game.canMoveKnight(this.position);
        },
        drop: monitor => {
            this.game.moveKnight(this.position);
        }
    });

    constructor(private dnd: SkyhookDndService, private game: GameService) { }

    ngOnDestroy() {
        this.target.unsubscribe();
    }

}