import { Component } from "@angular/core";

@Component({
    selector: 'simple-sortable-container',
    template:
    `
    <app-example-link path="sortable/fixed-height"></app-example-link>

    <p>If you know all the elements have the same height,
       then you can swap out the hover algorithm
       for one that reorders as soon as you hover on another element.
       It won't work with variable height elements.</p>
    <p>Simply add <code>ssSortableTrigger="fixed"</code> to a <code>&lt;skyhook-sortable-list&gt;</code> or <code>ssSortable</code></p>

    <app-fixed-sortable></app-fixed-sortable>
    `
})
export class ContainerComponent {
}
