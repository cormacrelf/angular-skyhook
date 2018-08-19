import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { Card } from "../card";
import { DragSource } from "angular-skyhook";
import { DraggedItem, SortableSpec } from "angular-skyhook-card-list";
import { ItemTypes } from "../item-types";
import { KanbanList } from "../lists";

@Component({
    selector: "kanban-list",
    templateUrl: "./kanban-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./kanban-list.component.scss"]
})
export class KanbanListComponent {
    ItemTypes = ItemTypes;
    @Input() list: KanbanList;
    @Input() source?: DragSource<DraggedItem<KanbanList>>;
    @Input() spec?: SortableSpec;
    @Input() dragging = false;
    @Input() placeholder?: boolean;

    @Output() addCard = new EventEmitter<string>();

    trackById = (_: any, x: Card) =>  x.id;
}
