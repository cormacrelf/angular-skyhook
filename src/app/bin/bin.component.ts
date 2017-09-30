import { Component, Input, OnInit } from '@angular/core';
import { DndConnectorService } from '../../angular-dnd';
import 'rxjs/Rx';

@Component({
  selector: 'app-bin',
  template: `
    <div *ngIf="collected$|async as c" class="dustbin pad" [dropTarget]="trashTarget" [ngStyle]="style$|async">
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
      const item = monitor.getItem();
      this.trashes.push(item.trash);
      return item;
    }
  });

  canDrop$ = this.trashTarget.monitor(m => m.canDrop());
  itemType$ = this.trashTarget.monitor(m => m.getItemType());

  collected$ = this.trashTarget.monitor(m => ({
    isOver: m.isOver(),
    canDrop: m.canDrop(),
    itemType: m.getItemType(),
  }));

  style$ = this.collected$.map(c => ({
    backgroundColor: c.isOver && c.canDrop ? '#cfcffc' : c.canDrop ? '#fffacf' : 'white',
  }));

  constructor(private dnd: DndConnectorService) { }

  empty() {
    this.trashes = [];
  }

  ngOnInit() {
    this.trashTarget.setType(this.accepts);
  }

}
