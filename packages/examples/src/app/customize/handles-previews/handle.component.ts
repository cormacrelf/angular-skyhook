
import { Component, OnInit } from '@angular/core';
import { DndService } from 'angular-hovercraft';
import { ItemTypes } from './item-types';

@Component({
  selector: 'handle',
  template: `
  <div [dragPreview]="source" [style.opacity]="opacity|async">
    <p>
      <span class="handle" [dragSource]="source"></span>
      Drag this!
    </p>
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
    .handle {
      width: 12px;
      height: 12px;
      background: darkgreen;
      display: inline-block;
    }
    div, p { display: inline-block;, padding: 3px; margin: 0; }
    `]
})
export class Handle {

  source = this.dnd.dragSource({
    type: ItemTypes.BOX,
    beginDrag: () => ({}),
  });

  opacity = this.source.collect(m => m.isDragging() ? 0.4 : 1);

  constructor( private dnd: DndService ) {}
}
