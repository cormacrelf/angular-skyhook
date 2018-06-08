import { Component } from '@angular/core';

@Component({
    selector: 'app-drag-layer-container',
    template: `
    <app-example-link path="customize/handles-previews"></app-example-link>
    <app-custom-drag-layer></app-custom-drag-layer>
    <app-drag-container></app-drag-container>
    `
})
export class ContainerComponent {

}