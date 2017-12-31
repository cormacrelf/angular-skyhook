import { Component, OnInit } from '@angular/core';
import { SkyhookDndService } from 'angular-skyhook';
import { ItemTypes } from './item-types';

@Component({
  selector: 'custom-preview',
  template: `
  <div [dragSource]="source" [style.opacity]="opacity$|async">
    <p>Drag this for image preview</p>
  </div>
  `,
  styles: [`
    div {
      border: 1px dashed #777;
      background: #fff;
      padding: 0.5rem 1rem;
      margin-bottom: .5rem;
      background-color: white;
      width: 8rem;;
      cursor: move;
    }
    div, p { display: inline-block;, padding: 3px; margin: 0; }
    `]
})
export class CustomPreview {

  source = this.dnd.dragSource(ItemTypes.BOX, {
    beginDrag: () => ({}),
  });

  opacity$ = this.source.listen(m => m.isDragging() ? 0.4 : 1);

  constructor( private dnd: SkyhookDndService ) {}
  ngOnInit() {
    var img = new Image();
    img.src = "https://angular.io/assets/images/logos/angular/angular.png";
    img.onload = () => this.source.connect(c => c.dragPreview(img));
  }

  ngOnDestroy() {
    this.source.unsubscribe();
  }
}
