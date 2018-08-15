import { Component, Input, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { Card } from "../card";
import { DragSource, SkyhookDndService } from "angular-skyhook";
import { DropEvent, DraggedItem, HoverEvent, SortableSpec } from "angular-skyhook-card-list";
import { Output } from "@angular/core";
import { getEmptyImage } from "react-dnd-html5-backend";
import { ItemTypes } from "../item-types";
import { KanbanList } from "app/kanban/lists";
import { Observable } from "rxjs";

type Source = DragSource<DraggedItem<KanbanList>>;

@Component({
    selector: "kanban-list", templateUrl: "./kanban-list.component.html", changeDetection: ChangeDetectionStrategy.OnPush, styleUrls: ["./kanban-list.component.scss"]
})
export class KanbanListComponent {
    @Input() list: KanbanList;

    @Input() source!: Source;
    @Input() dragging = false;
    @Input() spec!: SortableSpec;
    @Input() placeholder?: boolean;

    @Output() addCard = new EventEmitter<string>();

    ItemTypes = ItemTypes;

    ngOnDestroy() {
        console.warn('list destroyed');
    }

    trackById = (_: any, x: Card) =>  x.id;
}
