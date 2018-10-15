import { Component } from "@angular/core";

@Component({
    template: `
    <app-example-link path="bins"></app-example-link>

    <p>
    This example demonstrates:
    </p>
    <ul>
        <li>Making components conditionally draggable</li>
        <li>Making targets conditionally available for drops</li>
        <li>How drop targets can accept different item types</li>
    </ul>

    <skyhook-preview>
        <ng-template let-type let-item="item">
            <app-trash [type]="type" [inFlight]="true">
            </app-trash>
        </ng-template>
    </skyhook-preview>

    <div class="bins">
        <app-trash-pile type="PAPER"></app-trash-pile>
        <app-trash-pile type="ENVELOPE"></app-trash-pile>
        <app-trash-pile type="PARCEL"></app-trash-pile>
    </div>
    <div class="bins">
        <app-bin name="recycle" [accepts]="['PAPER', 'ENVELOPE']"></app-bin>
        <app-bin name="mailbox" [accepts]="['PARCEL', 'ENVELOPE']"></app-bin>
    </div>
    `,
    styles: [`

        .bins {
            margin-top: 20px;
            display: flex;
        }
        .bins > * {
            flex: 1;
            min-width: 100px;
        }
        .bins > *:not(:last-child) {
            margin-right: 4px;
        }

    `]
})
export class ContainerComponent {
}
