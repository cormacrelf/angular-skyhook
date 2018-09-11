import { Component, Input, NgZone, OnDestroy } from "@angular/core";
import { SkyhookDndService } from "@angular-skyhook/core";
import { NativeTypes } from "react-dnd-html5-backend";

interface NativeUrl {
    urls: string[];
}
interface NativeText {
    text: string;
}
interface NativeFile {
    files: File[];
}

@Component({
    selector: 'native-target',
    template: `
    <div class="target" [dropTarget]="target" [dropTargetTypes]="type">
        <p>Accepts <code>{{ type }}</code></p>
        <ng-content></ng-content>
        <pre *ngIf="dropped">{{ dropped | json }}</pre>
    </div>
    `,
    styles: [
        `
        :host {
            min-width: 200px;
        }
        .target {
            padding: 8px;
            background: #ddd;
            min-height: 140px;
            min-width: 0;
        }
        pre { overflow-x: auto; min-width: 0; }
        `
    ]
})
export class TargetComponent implements OnDestroy {
    @Input() type: string | symbol;
    droppedType = null;
    dropped = null;

    target = this.dnd.dropTarget<NativeUrl | NativeText | NativeFile>(null, {
        drop: monitor => {
            this.droppedType = monitor.getItemType();
            const item = monitor.getItem();
            if (monitor.getItemType() === NativeTypes.FILE) {
                const files = (item as NativeFile).files.map(f => `File named ${f.name}`);
                this.dropped = { files };
            } else {
                this.dropped = item;
            }
        }
    });

    constructor (private dnd: SkyhookDndService) {}

    ngOnDestroy() {
        this.target.unsubscribe();
    }
}
