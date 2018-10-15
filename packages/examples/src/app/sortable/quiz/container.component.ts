import { Component } from "@angular/core";

@Component({
    selector: 'quiz-container',
    template:
    `
    <app-example-link path="sortable/quiz"></app-example-link>
    <p>This example does the same list operations as the 'Simple list' example, but it does them with <code>immer</code> just to shake things up.</p>
    <p>It also uses the <code>[ssExternal]</code> directive to allow dragging in items that
       aren't already managed by a list.</p>
    <p>It also uses a 'spillTarget', attached outside the work area, which allows the preview to morph as
       you drag templates over the work area and out again.</p>

    <app-external-sortable></app-external-sortable>
    `
})
export class ContainerComponent {
}
