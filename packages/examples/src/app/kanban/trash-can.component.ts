import { Component, EventEmitter } from "@angular/core";
import { SkyhookDndService } from "angular-skyhook";
import { ItemTypes } from "./item-types";
import { DraggedItem } from "angular-skyhook-card-list";
import { Output } from "@angular/core";

@Component({
    selector: 'kanban-trash-can',
    template: `
    <div *ngIf="collect$|async as c" class="trash-can" [class.hidden]="!c.canDrop" [class.isOver]="c.isOver"
         [dropTarget]="target">
        <span>Delete card by dropping here</span>
    </div>
    `,
    styles: [`
    .trash-can {
        width: 200px;
        height: 200px;
        margin: 8px;
        padding: 8px;
        font-weight: 700;
        text-shadow: 1px 1px rgba(255,255,255,0.2);
        border-radius: 4px;
        border: 1px dashed #333;
    }
    .hidden {
        display: none;
    }
    .isOver {
        background: rgb(150, 0, 2);
    }
    `]
})
export class TrashCanComponent {
    @Output() dropped = new EventEmitter<DraggedItem>();
    target = this.dnd.dropTarget(ItemTypes.CARD, {
        drop: m => {
            const item = m.getItem() as DraggedItem;
            this.dropped.emit(item);
        }
    });
    collect$ = this.target.listen(m => ({
        canDrop: m.canDrop(),
        isOver: m.isOver()
    }));
    constructor(private dnd: SkyhookDndService) { }
}
