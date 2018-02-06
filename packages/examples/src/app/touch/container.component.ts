import { Component } from '@angular/core';
import { ItemTypes } from './itemTypes';
import { SkyhookDndService } from 'angular-skyhook';

@Component({
    selector: 'touch-container',
    template: `<div>
        <skyhook-preview>
            <ng-template let-type let-item="item">
                <ng-container [ngSwitch]="type">
                    <touch-item *ngSwitchCase="ItemTypes.ITEM" [color]="item.color">
                    </touch-item>
                </ng-container>
            </ng-template>
        </skyhook-preview>

        <touch-draggable-item [color]="'aliceblue'"></touch-draggable-item>
        <touch-draggable-item [color]="'lightgoldenrodyellow'"></touch-draggable-item>
        <touch-draggable-item></touch-draggable-item>
    </div>`
})
export class ContainerComponent {
    ItemTypes = ItemTypes;
}