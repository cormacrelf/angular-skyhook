import { Component } from "@angular/core";

@Component({
    template: `
    <app-example-link path="bins"></app-example-link>

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

    @media screen and (min-width: 48em) {
        .bins {
            margin-top: 20px;
            display: flex;
        }
        .bins > * {
            flex: 1;
            min-width: 200px;
            margin-right: 20px;
        }
    }

    `]
})
export class Container {
}