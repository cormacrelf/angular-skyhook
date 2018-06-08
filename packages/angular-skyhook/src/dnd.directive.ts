/**
 * [[include:Connecting-to-DOM.md]]
 * @module 2-Connecting-to-DOM
 * @preferred
 */
/** a second comment */


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
  HostBinding,
  NgZone,
  InjectionToken
} from '@angular/core';

import { invariant } from './internal/invariant';

import { DropTarget, DragSource } from './connection-types';
import { DragSourceOptions, DragPreviewOptions } from './connectors';
import { Subscription } from 'rxjs';
import { TypeOrTypeArray } from './type-ish';

/** @private */
const explanation =
  'You can only pass exactly one connection object to [dropTarget]. ' +
  'There is only one of each source/target/preview allowed per DOM element.'
;

/**
 * @private
 */
@Injectable()
export abstract class DndDirective {
  protected abstract connection: any;
  private deferredRequest = new Subscription();
  /** @private */
  constructor(protected elRef: ElementRef, private zone: NgZone) { }
  protected ngOnChanges() {
    invariant(
      typeof this.connection === 'object' && !Array.isArray(this.connection),
      explanation
    );
    this.zone.runOutsideAngular(() => {
      // discard an unresolved connection request
      // in the case where the previous one succeeded, deferredRequest is
      // already closed.
      this.deferredRequest.unsubscribe();
      // replace it with a new one
      if (this.connection) {
        this.deferredRequest = this.callHooks(this.connection);
      }
    });
  }
  protected ngOnDestroy() { this.deferredRequest.unsubscribe(); }
  protected abstract callHooks(conn: any): Subscription;
}

// Note: the T | undefined everywhere is from https://github.com/angular/angular-cli/issues/2034

@Directive({
  selector: '[dropTarget]'
})
export class DropTargetDirective extends DndDirective {
  protected connection: DropTarget | undefined;

  /** Which target to connect the DOM to */
  @Input('dropTarget') public dropTarget: DropTarget;
  /** Shortcut for setting a type on the connection.
   *  Lets you use Angular binding to do it. Runs [[DropTarget.setTypes]]. */
  @Input('dropTargetTypes') dropTargetTypes: TypeOrTypeArray;
  /** Reduce typo confusion by allowing non-plural version of dropTargetTypes */
  @Input('dropTargetType') set dropTargetType(t: TypeOrTypeArray) {
    this.dropTargetTypes = t;
  }

  protected ngOnChanges() {
    this.connection = this.dropTarget;
    if (this.connection && this.dropTargetTypes != null) {
      this.connection.setTypes(this.dropTargetTypes);
    }
    super.ngOnChanges();
  }

  protected callHooks(conn: DropTarget): Subscription {
    return conn.connect(c => c.dropTarget(this.elRef.nativeElement));
  }
}

@Directive({
  selector: '[dragSource]'
})
export class DragSourceDirective extends DndDirective {
  protected connection: DragSource | undefined;

  /** Which source to connect the DOM to */
  @Input('dragSource') dragSource: DragSource;
  /** Shortcut for setting a type on the connection.
   *  Lets you use Angular binding to do it. Runs [[DragSource.setType]]. */
  @Input('dragSourceType') dragSourceType: string | symbol;
  /** Pass an options object straight through to the internal connector. */
  @Input('dragSourceOptions') dragSourceOptions: DragSourceOptions | undefined;

  protected ngOnChanges() {
    this.connection = this.dragSource;
    if (this.connection && this.dragSourceType != null) {
      this.connection.setType(this.dragSourceType);
    }
    super.ngOnChanges();
  }

  protected callHooks(conn: DragSource): Subscription {
    return conn.connect(c => c.dragSource(this.elRef.nativeElement, this.dragSourceOptions));
  }

}

@Directive({
  selector: '[dragPreview]',
  inputs: ['dragPreview', 'dragPreviewOptions']
})
export class DragPreviewDirective extends DndDirective {
  protected connection: DragSource | undefined;
  @Input('dragPreview') public dragPreview: DragSource;
  @Input('dragPreviewOptions') dragPreviewOptions: DragPreviewOptions | undefined;

  protected ngOnChanges() {
    this.connection = this.dragPreview;
    super.ngOnChanges();
  }

  protected callHooks(conn: DragSource) {
    return conn.connect(c => c.dragPreview(this.elRef.nativeElement, this.dragPreviewOptions));
  }
}

// import { getEmptyImage } from 'react-dnd-html5-backend';
// we don't want to depend on the backend, so here that is, copied
/** @private */
let emptyImage: HTMLImageElement;
/**
 * Returns a 0x0 empty GIF for use as a drag preview.
 * */
function getEmptyImage() {
  if (!emptyImage) {
    emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }
  return emptyImage;
}

