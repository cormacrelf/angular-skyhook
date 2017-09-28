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
  NgZone,
  InjectionToken
} from '@angular/core';

import { DRAG_DROP_MANAGER, DragDropManager } from './manager';
import { TypeIsh } from './type-ish';

import { DropTargetConnector, DragSourceConnector, DropTargetConnection, DragSourceConnection } from './connector.service'

function forEachMaybeArray<T>(maybeArr: T | Array<T>, each: (t: T) => void) {
  if (maybeArr) {
    if (!Array.isArray(maybeArr)) {
      maybeArr = [maybeArr];
    }
    maybeArr.forEach(each);
  }
}

const UNSET = new InjectionToken("UNSET") as any;

@Directive({
  selector: '[dropTarget]'
})
export class DropTargetDirective implements OnChanges {
  @Input('dropTarget') dropTarget: DropTargetConnection | Array<DropTargetConnection>;
  // @Input('dropType') dropType: TypeIsh = UNSET;

  prevType: TypeIsh;
  constructor( protected elRef: ElementRef, @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager, private zone: NgZone) { }
  ngOnChanges() { this.callHooks(); }
  callHooks() {
    this.zone.runOutsideAngular(() => {
      forEachMaybeArray(this.dropTarget, t => {
        t.connector().dropTarget(this.elRef)
        // if (this.dropType != UNSET) {
        //   t.receiveType(this.dropType);
        // }
      });
    })
  }
}

@Directive({
  selector: '[dragSource]'
})
export class DragSourceDirective implements OnChanges {
  // @Input('dragType') dragType: TypeIsh = UNSET;
  @Input('dragSource') dragSource: DragSourceConnection | Array<DragSourceConnection>;
  constructor( protected elRef: ElementRef, @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager, private zone: NgZone) { }
  ngOnChanges() {
    this.zone.runOutsideAngular(() => {
      forEachMaybeArray(this.dragSource, t => {
        t.connector().dragSource(this.elRef);
      });
    })
  }
}

@Directive({
  selector: '[dragPreview]'
})
export class DragPreviewDirective implements OnChanges {
  @Input('dragPreview') dragPreview: DragSourceConnection | Array<DragSourceConnection>;
  constructor( protected elRef: ElementRef, @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager, private zone: NgZone) { }
  ngOnChanges() { this.callHooks(); }
  callHooks() {
    this.zone.runOutsideAngular(() => {
      forEachMaybeArray(this.dragPreview, t => t.connector().dragPreview(this.elRef));
    })
  }
}

