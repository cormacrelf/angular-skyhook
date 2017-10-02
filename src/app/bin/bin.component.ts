import { Component, Input, OnInit } from '@angular/core';
import { DndService } from '../../angular-dnd';
import 'rxjs/Rx';

@Component({
  selector: 'app-bin',
  template: `
    <div *ngIf="collected$|async as c" class="dustbin pad" [dropTarget]="trashTarget" [ngStyle]="getStyles(c)">
      {{ c.canDrop ? 'drop '+ c.itemType +' in the' : '' }} {{name}}
      <button (click)="empty()">empty bin</button>
      <pre>{{ trashes | json }}</pre>
    </div>
  `,
  styles: [`
    `]
})
export class BinComponent implements OnInit {

  @Input() name: string;
  @Input() accepts: string[] = ["TRASH"];
  trashes = []
  capacity = 6;

  trashTarget = this.dnd.dropTarget({
    canDrop: (monitor) => {
      return this.trashes.length < this.capacity;
    },
    drop: (monitor) => {
      // item is what we returned from beginDrag on the source
      const type = monitor.getItemType();
      this.trashes.push(type);
    }
  });

  collected$ = this.trashTarget.collect(m => ({
    isOver: m.isOver(),
    canDrop: m.canDrop(),
    itemType: m.getItemType(),
  }));

  constructor(private dnd: DndService) { }

  getStyles({ isOver, canDrop }) {
    return {
      backgroundColor: isOver && canDrop ? '#cfcffc' : canDrop ? '#fffacf' : 'white',
    }
  }

  empty() {
    this.trashes = [];
  }

  ngOnInit() {
    this.trashTarget.setTypes(this.accepts);
  }

}
