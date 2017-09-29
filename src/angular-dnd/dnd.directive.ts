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
import { DndTypeOrTypeArray } from './type-ish';

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

@Directive({
  selector: '[dropTarget]'
})
export class DropTargetDirective extends DndDirective {
  @Input('dropTarget') dropTarget: DropTargetConnection | Array<DropTargetConnection>;
  // @Input('dropType') dropType: DndTypeOrTypeArray = UNSET;
  prevType: DndTypeOrTypeArray;

  callHooks() {
    forEachMaybeArray(this.dropTarget, t => {
      t.connector().dropTarget(this.elRef.nativeElement)
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
  // @Input('dragType') dragType: DndTypeOrTypeArray = UNSET;
  @Input('dragSource') dragSource: DragSourceConnection | Array<DragSourceConnection>;
  callHooks() {
    forEachMaybeArray(this.dragSource, t => {
      console.log("ran change detection on directive");
      t.connector().dragSource(this.elRef.nativeElement);
    });
  }
}

@Directive({
  selector: '[dragPreview]'
})
export class DragPreviewDirective extends DndDirective {
  @Input('dragPreview') dragPreview: DragSourceConnection | Array<DragSourceConnection>;
  callHooks() {
    forEachMaybeArray(this.dragPreview, t => t.connector().dragPreview(this.elRef.nativeElement));
  }
}

