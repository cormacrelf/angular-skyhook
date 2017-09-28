import {
  Inject,
  Directive,
  ElementRef,
  Input,
  Output,
  OnInit,
  OnChanges,
  EventEmitter,
  HostListener,
  NgZone
} from '@angular/core';

import { DRAG_DROP_MANAGER, DragDropManager } from './manager';
import { TypeIsh } from './type-ish';

import { DropTargetConnector, DragSourceConnector } from './connector.service'

interface HasConnector<T> {
  connector(): T;
}

function forEachMaybeArray<T>(maybeArr: T | Array<T>, each: (t: T) => void) {
  if (maybeArr) {
    if (!Array.isArray(maybeArr)) {
      maybeArr = [maybeArr];
    }
    maybeArr.forEach(each);
  }
}

@Directive({
  selector: '[dropTarget]'
})
export class DropTargetDirective implements OnChanges {
  @Input('dropTarget') dropTarget: HasConnector<DropTargetConnector> | Array<HasConnector<DropTargetConnector>>;
  constructor( protected elRef: ElementRef, @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager, private zone: NgZone) { }
  ngOnChanges() { this.callHooks(); }
  callHooks() {
    this.zone.runOutsideAngular(() => {
      forEachMaybeArray(this.dropTarget, t => t.connector().dropTarget(this.elRef));
    })
  }
}

@Directive({
  selector: '[dragSource]'
})
export class DragSourceDirective implements OnChanges {
  @Input('dragType') dragType: TypeIsh;
  @Input('dragSource') dragSource: HasConnector<DragSourceConnector> | Array<HasConnector<DragSourceConnector>>;
  constructor( protected elRef: ElementRef, @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager, private zone: NgZone) { }
  ngOnChanges() { this.callHooks(); }
  callHooks() {
    this.zone.runOutsideAngular(() => {
      forEachMaybeArray(this.dragSource, t => t.connector().dragSource(this.elRef));
    })
  }
}

@Directive({
  selector: '[dragPreview]'
})
export class DragPreviewDirective implements OnChanges {
  @Input('dragPreview') dragPreview: HasConnector<DragSourceConnector> | Array<HasConnector<DragSourceConnector>>;
  constructor( protected elRef: ElementRef, @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager, private zone: NgZone) { }
  ngOnChanges() { this.callHooks(); }
  callHooks() {
    this.zone.runOutsideAngular(() => {
      forEachMaybeArray(this.dragPreview, t => t.connector().dragPreview(this.elRef));
    })
  }
}

