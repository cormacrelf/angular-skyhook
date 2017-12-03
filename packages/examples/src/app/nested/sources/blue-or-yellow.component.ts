import { Input, Component, OnInit } from '@angular/core';
import { DndService } from 'angular-hovercraft';
import { Colors } from './colors';

@Component({
  selector: 'app-blue-or-yellow',
  template: `
    <div [dragSource]="source" class="pushright" [style.background-color]="backgroundColor">
      <label>
        <input type="checkbox" value="forbid" (change)="toggle()" name="toggle"/>
        Forbid drag
      </label>
      <ng-content select="app-blue-or-yellow"></ng-content>
    </div>
  `,
  styles: [
    `
    :host { display: block; color: #777; }
    .pushright { margin-top: 15px;
      padding: 15px;
      display: inline-block;
      border: 1px dashed #777;
    }
    `
  ]
})
export class BlueOrYellowComponent {

  Colors = Colors;

  backgroundColor: string;
  @Input('color') set color(c: string) {

    this.source.setType(c);

    switch (c) {
      case Colors.YELLOW:
        this.backgroundColor = 'lightgoldenrodyellow';
        break;
      case Colors.BLUE:
        this.backgroundColor = 'lightblue';
        break;
    }

  }
  source = this.dnd.dragSource({
    beginDrag: () => ({}),
    canDrag: () => !this.forbid
  });

  @Input() forbid = false;
  toggle() {
    this.forbid = !this.forbid;
  }

  constructor (private dnd: DndService) {}

  ngOnDestroy() {
    this.source.destroy();
  }
}
