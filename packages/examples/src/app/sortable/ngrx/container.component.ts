import { Component } from "@angular/core";

@Component({
    selector: 'rxsort-container',
    template:
    `
    <app-example-link path="sortable/ngrx"></app-example-link>
    <p>This one uses an <code>@ngrx/store</code> with Immutable data. This is very convenient, since Immutable has its own 'insert' and 'remove' operations.</p>

    <rxsort-summary></rxsort-summary>
    <div class="sep"></div>
    <rxsort-sortable></rxsort-sortable>
    `,
    styles: [`
    .sep {
        border-bottom: 1px solid #999;
        margin-bottom: 8px;
        max-width: 700px;
    }
    `]
})
export class ContainerComponent {
}
