import { Component, OnInit } from '@angular/core';
import { DndService } from '../../../angular-dnd';
import { ItemTypes } from './item-types';

@Component({
  selector: 'custom-preview',
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
export class CustomPreview {

  source = this.dnd.dragSource({
    type: ItemTypes.BOX,
    beginDrag: () => ({}),
  });

  opacity = this.source.collect(m => m.isDragging() ? 0.4 : 1);

  constructor( private dnd: DndService ) {}
  ngOnInit() {
    var img = new Image();
    img.src = "https://angular.io/assets/images/logos/angular/angular.png";
    img.onload = () => this.source.connect(c => c.dragPreview(img));
  }
}
