import { Component } from "@angular/core";

@Component({
    selector: 'simple-sortable-container',
    template:
    `
    <app-example-link path="sortable/simple"></app-example-link>

    <p> This example is like the 'Basic Sortable', except you don't have to
    write a complicated hover function. You can focus on the model data. </p>

    <app-simple-sortable></app-simple-sortable>
    `
})
export class ContainerComponent {
}
