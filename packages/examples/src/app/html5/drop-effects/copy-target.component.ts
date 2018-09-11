import { Component } from "@angular/core";
import { SkyhookDndService } from "@angular-skyhook/core";
import { ItemTypes } from "./item-types";

@Component({
    selector: 'de-copy-target',
    template: `
    <div [dropTarget]="target" class="target" [class.over]="over$|async">
        <p>Drag one of the above boxes. Hold 'alt' when dragging the default one to make it a copy.</p>
        <ng-content *ngIf="!(canDrop$|async); else dropHere"></ng-content>
        <ng-template #dropHere>
            <p>Drop here</p>
        </ng-template>
    </div>
    `,
    styles: [`
    .target { max-width: 300px; height: 200px; background: #ddd; padding: 1em; }
    .over { background: #bbb; }
    `]
})
export class CopyTargetComponent {
    target = this.dnd.dropTarget(ItemTypes.COPYABLE_ITEM, { });

    canDrop$ = this.target.listen(m => m.canDrop());
    over$ = this.target.listen(m => m.isOver() && m.canDrop());

    constructor(private dnd: SkyhookDndService) {}
}
