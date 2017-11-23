import { Component } from "@angular/core";

@Component({
    template: `
    <div class="bins">
        <app-trash type="PAPER"></app-trash>
        <app-trash type="ENVELOPE"></app-trash>
        <app-trash type="PARCEL"></app-trash>
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