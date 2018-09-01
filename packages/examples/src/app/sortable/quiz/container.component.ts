import { Component } from "@angular/core";

@Component({
    selector: 'simple-sortable-container',
    template:
    `
    <app-example-link path="sortable/external"></app-example-link>
    <p> Note: uses unreleased code. </p>

    <p>This example does the same list operations as the 'Simple list' example.</p>
    <p>However, it uses the <code>[sortableExternal]</code> directive to allow dragging in items that
       aren't already managed by a list.</p>

    <app-external-sortable></app-external-sortable>
    `
})
export class ContainerComponent {
}
