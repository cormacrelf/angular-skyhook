import { Component, ViewChild, ElementRef } from "@angular/core";
import { SkyhookDndService } from "angular-skyhook";
import { DraggedItem, SharedSortableService } from "angular-skyhook-card-list";

@Component({
    selector: 'simple-sortable-container',
    template:
    `
    <div [dragSource]="source">
        <input #text value="drag me in" />
    </div>
    <app-simple-sortable></app-simple-sortable>
    `
    // <app-simple-sortable></app-simple-sortable>
})
export class ContainerComponent {
    id = 1000;
    @ViewChild('text') text: ElementRef<HTMLInputElement>;
    source = this.dnd.dragSource("SIMPLE", {
        beginDrag: monitor => {
            // TODO: provide static method for implementing beginDrag
            return {
                data: {
                    id: this.id++,
                    name: this.text.nativeElement.value
                },
                type: "SIMPLE",
                index: 0,
                isCopy: false,
                // TODO: allow string IDs
                listId: -1,
                // TODO: remove size
                size: { width: 0, height: 0, style: () => ({ width: '', height: '' }) },
                hover: { index: 1, listId: -1 }
            } as DraggedItem
        }
    });
    constructor(private dnd: SkyhookDndService, private sortable: SharedSortableService<any>) {
    }
    ngOnInit() {
        this.sortable.register("SIMPLE", {
            trackBy: (data) => data.id,
            // copy: (item) => {
            //     return item.listId === 'me';
            // },
            // clone: (data: { name: string; }) => {
            //     return { name: data.name + ' cloned' };
            // },
            // canDrag: (data, listId) => {
            //     return listId === 'me';
            // },
            // canDrop: (item) => {
            //     return item.hover.listId === 'you';
            // }
        });
    }
}
