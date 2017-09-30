import { Input, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DndConnectorService, DragPreviewOptions } from '../../angular-dnd';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-trash',
  template: `
    <p>
      <button (click)="litter($event)">add more</button>
    </p>
    <div [style.display]="(isDragging$|async) ? 'none' : 'block'" class="trash pad" [class.can-drag]="remain > 0"
      [dragSource]="trashSource">

      <!-- <div class="handle" [dragSource]="trashSource">handle</div> -->
      {{ kind }} <span *ngIf="!(isDragging$|async)">({{remain}} left)</span>
    </div>

  `,
  styles: [`
    .trash { background: #ffccff; width: 100px; }
    .trash:not(.can-drag) { background: #eee; }
    .handle { background: #ccf; cursor: move; }
    `
  ]
})
export class TrashComponent implements OnInit, OnDestroy {

  @Input() kind: string = 'TRASH';
  remain = 3;
  count = 0;

  trashSource = this.dnd.dragSource({
    canDrag: (monitor) => this.remain > 0,
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
  });

  isDragging$ = this.trashSource.monitor(m => m.canDrag() && m.isDragging());

  // collect$ = this.trashSource.monitor(m => {
  //   return { canDrag: m.canDrag(), isDragging: m.isDragging() }
  // });

  // changeCount$ = this.collect$.scan((acc, x) => acc + 1, 0);

  destroy$ = new Subject();

  constructor(private dnd: DndConnectorService) { }

  ngOnInit() {
    this.trashSource.destroyOn(this.destroy$);

    // const img = new Image();
    // img.onload = () => this.trashSource.connector().dragPreview(img);
    // // could easily be a data:// uri
    // img.src = 'https://angular.io/assets/images/logos/angular/angular.png';
  }

  ngOnChanges() {
    console.log('ngOnChanges');
    this.trashSource.setType(this.kind);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  litter() {
    this.remain += 5;
  }

}
