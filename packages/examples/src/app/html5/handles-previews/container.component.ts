import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nested-targets',
  template: `
  <div>
  <app-example-link path="html5/handles-previews"></app-example-link>
  <p>
    Skyhook lets you specify which element will be draggable, and which one will actually be the preview that follows your mouse.
  </p>
  <p>
    If you combine both by marking an outer element as the preview and one inside it as the source, you get a handle.
  </p>
  <p>
    You can also connect an Image node as the preview, once it has loaded.
  </p>
  <handle></handle>
  <custom-preview></custom-preview>
  </div>
  `,
  styles: [`
    .nested-targets-wrapper {
      display: flex;
    }
    .nested-targets-wrapper > * {
      margin: 20px;
    }
    `]
})
export class ContainerComponent {
}
