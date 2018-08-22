import { Component, ViewChild, ElementRef } from "@angular/core";
import { SkyhookDndService } from "angular-skyhook";
import { DraggedItem, SharedSortableService, Size } from "angular-skyhook-card-list";

@Component({
    selector: 'simple-sortable-container',
    template:
    `
    <app-simple-sortable></app-simple-sortable>
    `
})
export class ContainerComponent {
    id = 1000;
    source = this.dnd.dragSource<DraggedItem<any>>("SIMPLE", {
        beginDrag: monitor => {
            return {
                data: { id: this.id++, name: "whatever" },
                type: "SIMPLE",
                index: 0,
                listId: "somewhere EXTERNAL",
                size: new Size(0,0),
                hover: { index: 0, listId: "somewhere EXTERNAL" }
            }
        }
    });
    constructor(private dnd: SkyhookDndService) { }
}
