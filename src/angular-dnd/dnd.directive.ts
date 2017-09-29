import {
  Inject,
  Injectable,
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

@Injectable()
abstract class DndDirective implements OnChanges {
  constructor( protected elRef: ElementRef, private zone: NgZone) { }
  ngOnChanges() {
    this.zone.runOutsideAngular(() => {
      this.callHooks();
    })
  }
  abstract callHooks(): void;
}

const UNSET = new InjectionToken("UNSET") as any;

@Directive({
  selector: '[dropTarget]'
})
export class DropTargetDirective extends DndDirective {
  @Input('dropTarget') dropTarget: DropTargetConnection | Array<DropTargetConnection>;
  // @Input('dropType') dropType: TypeIsh = UNSET;
  prevType: TypeIsh;

  callHooks() {
    forEachMaybeArray(this.dropTarget, t => {
      t.connector().dropTarget(this.elRef.nativeElement, t.options())
      // if (this.dropType != UNSET) {
      //   t.receiveType(this.dropType);
      // }
    });
  }
}

@Directive({
  selector: '[dragSource]'
})
export class DragSourceDirective extends DndDirective {
  // @Input('dragType') dragType: TypeIsh = UNSET;
  @Input('dragSource') dragSource: DragSourceConnection | Array<DragSourceConnection>;
  callHooks() {
    forEachMaybeArray(this.dragSource, t => {
      t.connector().dragSource(this.elRef.nativeElement, t.options());
    });
  }
}

@Directive({
  selector: '[dragPreview]'
})
export class DragPreviewDirective extends DndDirective {
  @Input('dragPreview') dragPreview: DragSourceConnection | Array<DragSourceConnection>;
  callHooks() {
    forEachMaybeArray(this.dragPreview, t => t.connector().dragPreview(this.elRef.nativeElement, t.options()));
  }
}

