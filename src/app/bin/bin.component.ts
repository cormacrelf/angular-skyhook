import { Component, Input, OnInit } from '@angular/core';
import { DndConnectorService } from '../../angular-dnd';
import 'rxjs/Rx';

@Component({
  selector: 'app-bin',
  template: `
    <div class="dustbin" [dropTarget]="trashTarget" [ngStyle]="style$|async">
      {{ display$ | async }}
      <button (click)="empty()">empty bin</button>
      <pre>{{ trashes | json }}</pre>
    </div>
  `,
  styles: [`
    div {
      margin-top: 20px;
    }
    `]
})
export class BinComponent implements OnInit {

  @Input() name: string;
  @Input() accepts: string[] = ["TRASH"];
  trashes = []
  capacity = 6;

  trashTarget: any;
  collected$: any;
  style$: any;
  display$: any;

  constructor(private dnd: DndConnectorService) { }

  empty() {
    this.trashes = [];
  }

  ngOnInit() {
    console.log(this.accepts);
  this.trashTarget = this.dnd.dropTarget(this.accepts, {
    canDrop: (monitor) => {
      return this.trashes.length < this.capacity;
    },
    drop: (monitor) => {
      // item is what we returned from beginDrag
      const item = monitor.getItem();
      this.trashes.push(item.trash);
      return item;
    }
  })
  this.collected$ = this.trashTarget.collect().map(monitor => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }))
  this.style$ = this.collected$.map(c => ({
    backgroundColor: c.isOver && c.canDrop ? '#cfcffc' : c.canDrop ? '#fffacf' : 'white',
  }))
  this.display$ = this.collected$.map(x => {
    return x.canDrop ? "drop it in the " + this.name : this.name;
  })


  }

}
