import { Component, OnInit } from "@angular/core";
import { Colors } from "./colors";

@Component({
    selector: "app-sources",
    template: `
  <app-example-link path="nested/sources"></app-example-link>
  <div class="nested-sources-wrapper">
    <app-blue-or-yellow [color]="Colors.BLUE">
      <app-blue-or-yellow [color]="Colors.YELLOW">
        <app-blue-or-yellow [color]="Colors.YELLOW"></app-blue-or-yellow>
        <app-blue-or-yellow [color]="Colors.BLUE"></app-blue-or-yellow>
      </app-blue-or-yellow>
      <app-blue-or-yellow [color]="Colors.BLUE">
        <app-blue-or-yellow [color]="Colors.YELLOW"></app-blue-or-yellow>
      </app-blue-or-yellow>
    </app-blue-or-yellow>
    <app-nested-source-targetbox></app-nested-source-targetbox>
  </div>
  `,
    styles: [
        `
            .nested-sources-wrapper {
                display: flex;
            }
            .nested-sources-wrapper > * {
                margin: 20px;
            }
        `
    ]
})
export class ContainerComponent {
    Colors = Colors;
}
