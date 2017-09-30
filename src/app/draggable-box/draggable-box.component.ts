import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DndService, DragPreviewOptions } from '../../angular-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

@Component({
  selector: 'app-draggable-box',
  template: `
  <div class="draggable-box" [dragSource]="source" [ngStyle]="getStyles(isDragging$|async)" >
    <app-box [title]="title"></app-box>
  </div>
  `,
})
export class DraggableBoxComponent implements OnInit, OnDestroy {

  @Input() id;
  @Input() title;
  @Input() left;
  @Input() top;

  previewOptions: DragPreviewOptions = {
    // offsetX: -10,
    // offsetY: -10,
    captureDraggingState: true,
  };

  source = this.dnd.dragSource({
    type: 'BOX',
    beginDrag: () => {
      const  { id, title, left, top } = this;
      return { id, title, left, top };
    }
  });

  isDragging$ = this.source.collect(m => m.isDragging());


  constructor(private dnd: DndService) { }

  ngOnInit() {
    this.source.connector().dragPreview(getEmptyImage(), { captureDraggingState: true });
  }
  ngOnDestroy() {
    this.source.destroy();
  }

  getStyles(isDragging: boolean) {
    const { left, top } = this;
    const transform = `translate3d(${left}px, ${top}px, 0)`;

    return {
      position: 'absolute',
      transform,
      WebkitTransform: transform,
      // IE fallback: hide the real node using CSS when dragging
      // because IE will ignore our custom "empty image" drag preview.
      opacity: isDragging ? 0 : 1,
      height: isDragging ? 0 : '',
    };
  }

}
