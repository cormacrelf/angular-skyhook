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

import { DropTarget, DragSource } from './connection-types'
import { DragSourceOptions, DragPreviewOptions } from './connectors';
import { Subscription } from 'rxjs/Subscription';

/** @private */
const explanation =
  "You can only pass exactly one connection object to [dropTarget]. " +
  "There is only one of each source/target/preview allowed per DOM element."
;

/**
 * @private
 */
@Injectable()
export abstract class DndDirective {
  protected abstract connection: any;
  private deferredRequest = new Subscription();
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
    })
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

  public dropTarget: DropTarget;

  @Input('dropTarget') private set setDropTarget(connection: DropTarget) {
    this.connection = connection;
  };
  protected callHooks(conn: DropTarget): Subscription {
    return conn.connect(c => c.dropTarget(this.elRef.nativeElement));
  }
}

@Directive({
  selector: '[dragSource]'
})
export class DragSourceDirective extends DndDirective {
  protected connection: DragSource | undefined;

  public dragSource: DragSource;

  @Input('dragSource') private set setDragSource(connection: DragSource) {
    this.connection = connection;
  };
  @Input('dragSourceOptions') dragSourceOptions: DragSourceOptions | undefined;
  protected callHooks(conn: DragSource) {
    return conn.connect(c => c.dragSource(this.elRef.nativeElement, this.dragSourceOptions));
  }
}

@Directive({
  selector: '[dragPreview]',
  inputs: ['dragPreview', 'dragPreviewOptions']
})
export class DragPreviewDirective extends DndDirective {
  /** Supply with `[dragPreview]="source"` */
  @Input('dragPreview') connection: DragSource | undefined;
  @Input('dragPreviewOptions') dragPreviewOptions: DragPreviewOptions | undefined;
  protected callHooks(conn: DragSource) {
    return conn.connect(c => c.dragPreview(this.elRef.nativeElement, this.dragPreviewOptions));
  }
}

// import { getEmptyImage } from 'react-dnd-html5-backend';
// we don't want to depend on the backend, so here that is, copied
/** @private */
let emptyImage: HTMLImageElement;
/** @private */
function getEmptyImage() {
  if (!emptyImage) {
    emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }
  return emptyImage;
}

@Directive({
  selector: '[noDragPreview]',
  inputs: ['noDragPreview', 'hideCompletely']
})
export class NoDragPreviewDirective {

  /** Supply with `[noDragPreview]="source"`, where source is a DragSource connection.` */
  @Input('noDragPreview') connection: DragSource | undefined;
  @Input('hideCompletely') hideCompletely: boolean = false;

  @HostBinding("style.opacity") private opacity: number | null;
  @HostBinding("style.height") private height: number | null;

  private subscription: Subscription;

  protected ngOnInit() {
    if (this.connection) {
      this.subscription = this.connection.listen(m => m.isDragging()).subscribe(isDragging => {
        if (this.hideCompletely) {
          this.opacity = isDragging ? 0 : null;
          this.height = isDragging ? 0 : null;
        }
      });
    }
  }

  protected ngOnChanges() {
    if (this.connection) {
      // usually you will need to use img.onload = () => this.connection.connect( ... )
      // but here, empty image is fully specified as base64, so we can use it immediately.
      this.connection.connect(c => c.dragPreview(getEmptyImage(), {
        captureDraggingState: this.hideCompletely,
      }));
    }
  }

  protected ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe()
  }

}
