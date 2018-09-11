import { Component, Output, EventEmitter, Input } from "@angular/core";
import { SkyhookDndService } from "@angular-skyhook/core";
import { ItemTypes } from "./item-types";

interface DropResult {
    dropEffect?: 'copy' | 'move' | 'link' | 'none';
}

@Component({
    selector: 'de-box',
    template: `
    <p [dragSource]="source" [dragSourceOptions]="force && { dropEffect: force }">
        Drag me (<code>{{ force ? force : 'default behaviour' }}</code>)
    </p>
    `,
    styles: [`
    p {
        display: inline-block;
        padding: 0.5em;
        border: 1px dashed #333;
        margin: 0;
        margin-bottom: 8px;
        margin-right: 8px;
        background: #fff;
    }
    `]
})
export class BoxComponent {
    @Output() dropped = new EventEmitter<string>();
    @Input() force: string = undefined;

    source = this.dnd.dragSource<{}, DropResult>(ItemTypes.COPYABLE_ITEM, {
        beginDrag: monitor => ({}),
        endDrag: monitor => {
            const result = monitor.getDropResult();
            if (result) {
                this.dropped.emit(result.dropEffect);
            }
        }
    });
    constructor(private dnd: SkyhookDndService) { }
}
