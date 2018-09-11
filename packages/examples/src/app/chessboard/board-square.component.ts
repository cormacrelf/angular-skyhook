import { Component, Input  } from "@angular/core";
import { Coord } from './coord';
import { GameService } from "./game.service";
import { SkyhookDndService } from "@angular-skyhook/core";
import { ItemTypes } from "./constants";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-board-square',
    template: `
    <div class="wrapper" [dropTarget]="target">
        <app-square [black]="black">
            <ng-content></ng-content>
        </app-square>
        <div class="overlay" *ngIf="showOverlay$|async" [ngStyle]="overlayStyle$|async"></div>
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

    collected$ = this.target.listen(m => ({
        canDrop: m.canDrop(),
        isOver: m.isOver(),
    }));
    
    showOverlay$ = this.collected$.pipe(map(c => c.isOver || c.canDrop));

    overlayStyle$ = this.collected$.pipe(map(coll => {
        let { canDrop, isOver } = coll;
        let bg: string = "rgba(0,0,0,0)";
        if (canDrop && isOver) { bg = 'green'; }
        else if (canDrop && !isOver) { bg = 'yellow'; }
        else if (!canDrop && isOver) { bg = 'red'; }
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: bg
        }
    }));

    constructor(private dnd: SkyhookDndService, private game: GameService) { }

    ngOnDestroy() {
        this.target.unsubscribe();
    }

}