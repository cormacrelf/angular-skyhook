import { Input, Component, OnInit } from '@angular/core';
import { SkyhookDndService } from "@angular-skyhook/core";
import { Colors } from './colors';
import { map, filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-nested-source-targetbox',
  template: `
    <div [dropTarget]="target" class="box" [class.fade]="fade$|async" [style.background-color]="draggingColor$|async" >
      <p>Drop here.</p>
      <ng-container *ngIf="!(canDrop$|async) && lastDroppedColor != null">
        <p [style.background-color]="backgroundColor" [style.padding.px]="5">Last dropped: {{ lastDroppedColor }}</p>
      </ng-container>
    </div>
  `,
  styles: [
    `
    .box {
      font-size: 120%;
      color: #777;
      margin-top: 15px;
      max-width: 300px;
      height: 200px;
      padding: 20px;
      border: 1px dashed #777;
      text-align: center;
    }
    .fade {
      opacity: 0.5;
    }
    `
  ]
})
export class TargetBox {

  Colors = Colors;

  lastDroppedColor: string;
  backgroundColor: string;

  target = this.dnd.dropTarget([Colors.BLUE, Colors.YELLOW], {
    drop: (monitor) => {
      this.lastDroppedColor = monitor.getItemType() as string;
    }
  });

  canDrop$ = this.target.listen(m => m.canDrop());
  fade$ = this.target.listen(m => m.canDrop() && !m.isOver());
  draggingColor$ = this.target
    .listen(m => m.getItemType())
    .pipe(map(t => this.cssColor(t)));

  constructor (private dnd: SkyhookDndService) {}

  cssColor(c: string|symbol) {
    switch (c) {
      case Colors.YELLOW:
        return 'lightgoldenrodyellow';
      case Colors.BLUE:
        return 'lightblue';
      default:
        return '#fff';
    }
  }

  ngOnDestroy() {
    this.target.unsubscribe();
  }

}

