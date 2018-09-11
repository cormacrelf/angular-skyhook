import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SkyhookDndService } from "@angular-skyhook/core";
import { ItemTypes } from './itemTypes';

@Component({
  selector: 'drilldown-source',
  template: `
  <div [dragSource]="source" [style.opacity]="opacity|async">
    <p>Drag this!</p>
  </div>
  `,
  styles: [`
    div {
      border: 1px dashed #777;
      background: #fff;
      padding: 0.5rem 1rem;
      margin-ottom: .5rem;
      background-olor: white;
      width: 8rem;;
    }
    div, p { display: inline-block;, padding: 3px; margin: 0; }
    `]
})
export class Box {

  @Output() beginDrag = new EventEmitter<void>();
  @Output() endDrag = new EventEmitter<void>();

  source = this.dnd.dragSource(ItemTypes.EMAIL, {
    beginDrag: () => {
      this.beginDrag.emit();
      return {}
    },
    endDrag: () => {
      this.endDrag.emit();
    }
  });

  opacity = this.source.listen(m => m.isDragging() ? 0.4 : 1);

  constructor( private dnd: SkyhookDndService ) {}

  ngOnDestroy() {
    this.source.unsubscribe();
  }
}
