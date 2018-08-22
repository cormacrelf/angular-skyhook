import { Component } from "@angular/core";

@Component({
    selector: 'simple-sortable-container',
    template:
    `
    <p> Note: uses unreleased code. </p>

    <p> This example is like the 'Basic Sortable', except you don't have to
    write a complicated hover function. You can focus on the model data. </p>

    <app-simple-sortable></app-simple-sortable>
    `
})
export class ContainerComponent {
}
