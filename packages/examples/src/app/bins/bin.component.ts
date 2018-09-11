import { Component, Input, OnInit } from '@angular/core';
import { SkyhookDndService } from "@angular-skyhook/core";

@Component({
  selector: 'app-bin',
  template: `
    <div *ngIf="collected$|async as c" class="dustbin pad" [dropTarget]="trashTarget" [ngStyle]="getStyles(c)">
      <p>
        <b>
        {{ c.canDrop ? 'drop '+ c.itemType +' in the' : '' }}
        {{ c.isOver && !hasCapacity ? 'cannot drop, ' : '' }}
        {{ name }}
        {{ hasCapacity ? '' : ' is full!' }}
        </b>
      </p>
      <p>
        <button (click)="empty()">empty {{ name }}</button>
      </p>
      <pre>{{ trashes | json }}</pre>
    </div>
  `,
  styles: [`
  `]
})
export class Bin implements OnInit {

  @Input() name: string;
  @Input() accepts: string[] = ["TRASH"];
  trashes = []
  capacity = 6;

  get hasCapacity() {
    return this.trashes.length < this.capacity;
  }

  trashTarget = this.dnd.dropTarget(null, {
    canDrop: (monitor) => {
      return this.hasCapacity;
    },
    drop: (monitor) => {
      // item is what we returned from beginDrag on the source
      const type = monitor.getItemType();
      this.trashes.unshift(type);
    }
  });

  collected$ = this.trashTarget.listen(m => ({
    isOver: m.isOver(),
    canDrop: m.canDrop(),
    itemType: m.getItemType(),
  }));

  constructor(private dnd: SkyhookDndService) { }

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

  ngOnDestroy() {
    this.trashTarget.unsubscribe();
  }

}
