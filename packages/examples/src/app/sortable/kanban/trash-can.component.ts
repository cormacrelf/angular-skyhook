import { Component, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { SkyhookDndService } from "@angular-skyhook/core";
import { ItemTypes } from "./item-types";
import { DraggedItem } from "@angular-skyhook/sortable";
import { Output } from "@angular/core";
import { Card } from './card';

@Component({
    selector: 'kanban-trash-can',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div *ngIf="collect$|async as c"
        class="trash-can"
        [class.isOver]="c.isOver"
        [dropTarget]="target">
        <div>
            <i class="fas fa-trash-alt"></i>
            <span>Drop here to delete</span>
        </div>
        <div class="space" [ngStyle]="getStyle(c.isOver, c.item)"></div>
    </div>
    `,
    styles: [`
    .fas { margin-right: 8px; }
    .trash-can {
        margin: 8px;
        padding: 8px;
        font-weight: 700;
        text-shadow: 1px 1px rgba(255,255,255,0.2);
        border-radius: 4px;
        border: 1px dashed #333;
        text-align: center;
        transform-origin: 100% 100%;
        transition: transform 50ms ease-out;
    }
    .space {
        height: 0;
        width: 0;
        transition: all 50ms ease-out;
    }
    .isOver {
        transition: transform 50ms ease-in;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(1.2);
    }
    `]
})
export class TrashCanComponent {
    @Output() dropped = new EventEmitter<DraggedItem<Card>>();
    target = this.dnd.dropTarget<DraggedItem<Card>>(ItemTypes.CARD, {
        canDrop: monitor => {
            return monitor.getItem().isInternal;
        },
        drop: monitor => {
            this.dropped.emit(monitor.getItem());
        }
    });
    collect$ = this.target.listen(m => ({
        item: m.getItem(),
        isOver: m.isOver() && m.canDrop()
    }));
    constructor(private dnd: SkyhookDndService) { }
    getStyle(isOver: boolean, item: DraggedItem<Card>) {
        if (!isOver || !item) { return {} }
        return {
            ...item.size.style(),
            transition: 'all 50ms ease-in'
        };
    }
}
