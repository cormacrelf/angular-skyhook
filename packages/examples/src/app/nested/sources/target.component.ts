import { Input, Component, OnInit } from '@angular/core';
import { DndService } from 'angular-hovercraft';
import { Colors } from './colors';

@Component({
  selector: 'app-nested-source-targetbox',
  template: `
    <div [dropTarget]="target" class="box" >
      <p>Drop here.</p>
      <ng-container *ngIf="!(canDrop$|async) && lastDroppedColor">
        <p [style.background-color]="backgroundColor" [style.padding.px]="5">last dropped: {{lastDroppedColor}}</p>
      </ng-container>
    </div>
  `,
  styles: [
    `
    .box {
      color: #777;
      margin-top: 15px;
      width: 200px;
      height: 200px;
      padding: 20px;
      border: 1px dashed #777;
      text-align: center;
    }
    .last-dropped {
      background: black;
      width: 12rem;
      height: 12rem;
      margin: 0 auto;
    }
    `
  ]
})
export class TargetBox {

  Colors = Colors;

  lastDroppedColor: string;
  backgroundColor: string;
  set color(c: string) {
    this.lastDroppedColor = c;
    switch (c) {
      case Colors.YELLOW:
        this.backgroundColor = 'lightgoldenrodyellow';
        break;
      case Colors.BLUE:
        this.backgroundColor = 'lightblue';
        break;
    }
  }
  target = this.dnd.dropTarget({
    types: [Colors.BLUE, Colors.YELLOW],
    drop: (monitor) => {
      this.color = monitor.getItemType() as string;
    }
  });
  canDrop$ = this.target.collect(m => m.canDrop());

  constructor (private dnd: DndService) {}

  ngOnDestroy() {
    this.target.unsubscribe();
  }

}

