import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { DndConnectorService } from '../../angular-dnd';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-trash',
  template: `
  <p>
    <button (click)="litter($event)">litter</button>
  </p>
    <div class="trash" [class.empty]="remain == 0" [dragSource]="trashSource">
      {{ kind }} ({{this.remain}} left)
    </div>
  `,
  styles: [`
    .trash { background: #ffccff; width: 100px; }
    .empty { background: #eee; }
    `
  ]
})
export class TrashComponent implements OnInit, OnDestroy {

  @Input() kind: string = 'TRASH';
  remain = 3;
  count = 0;

  trashSource = this.dnd.dragSource({
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
  })

  destroy$ = new Subject();

  constructor(private dnd: DndConnectorService) { }

  ngOnInit() {
    this.trashSource.destroyOn(this.destroy$);
  }

  ngOnChanges() {
    console.log(this.kind);
    this.trashSource.setType(this.kind);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  litter() {
    this.remain += 5;
  }

}
