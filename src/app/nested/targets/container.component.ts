import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nested-targets',
  template: `
  <div class="nested-targets-wrapper">
    <app-nested-targets-dustbin [greedy]="true">
      <app-nested-targets-dustbin [greedy]="true">
        <app-nested-targets-dustbin [greedy]="true"></app-nested-targets-dustbin>
      </app-nested-targets-dustbin>
    </app-nested-targets-dustbin>

    <app-nested-targets-dustbin >
      <app-nested-targets-dustbin >
        <app-nested-targets-dustbin ></app-nested-targets-dustbin>
      </app-nested-targets-dustbin>
    </app-nested-targets-dustbin>
  </div>

  <app-nested-targets-box></app-nested-targets-box>
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
export class Container {
}
