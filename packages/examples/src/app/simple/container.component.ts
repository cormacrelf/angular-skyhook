import { Component, ViewChild, ElementRef } from "@angular/core";
import { SkyhookDndService } from "angular-skyhook";
import { DraggedItem } from "angular-skyhook-card-list";

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
            let id = this.id++;
            // TODO: provide static method for implementing beginDrag
            return {
                data: {
                    // TODO: don't require having an id
                    id,
                    title: this.text.nativeElement.value
                },
                id: id,
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
    constructor( private dnd: SkyhookDndService ) {}
}
