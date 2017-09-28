import { Input, Component, OnInit } from '@angular/core';
import { DndConnectorService } from '../../angular-dnd';

@Component({
  selector: 'app-trash',
  template: `
  <p>
    <button (click)="litter($event)">litter</button>
  </p>
    <div class="trash" [class.empty]="remain == 0" [dragSource]="trash">
      {{ kind }} ({{this.remain}} left)
    </div>
  `,
  styles: [`
    .trash { background: #ffccff; width: 100px; }
    .empty { background: #eee; }
    `
  ]
})
export class TrashComponent implements OnInit {

  @Input() kind: string = 'TRASH';
  remain = 3;
  count = 0;

  trashSource = {
    canDrag: (monitor) => {
      return this.remain > 0;
    },
    beginDrag: (monitor) => {
      // this is the 'item' that's in-flight
      return { trash: this.kind + ' ' + this.count++ };
    },
    endDrag: (monitor) => {
      // monitor is a nice view into the drag state
      if (monitor.didDrop()) {
        this.remain--;
        // you might fire an action here
        console.log(monitor.getDropResult());
      }
    }
  }

  trash


  constructor(private dnd: DndConnectorService) { }

  ngOnInit() {
    this.trash = this.dnd.dragSource(this.kind, this.trashSource)
  }

  litter() {
    this.remain += 5;
  }

}
