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

import { invariant } from './invariant';

import { DropTargetConnection, DragSourceOptions, DragSourceConnection, DragPreviewOptions } from './connection-types'
import { Subscription } from 'rxjs/Subscription';

const explanation =
  "You can only pass exactly one connection object to [dropTarget]. " +
  "There is only one of each source/target/preview allowed per DOM element."
;

@Injectable()
abstract class DndDirective implements OnChanges {
  abstract connection: any;
  deferredRequest = new Subscription();
  constructor(protected elRef: ElementRef, private zone: NgZone) { }
  ngOnChanges() {
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
      this.deferredRequest = this.callHooks();
    })
  }
  ngOnDestroy() { this.deferredRequest.unsubscribe(); }
  abstract callHooks(): Subscription;
}

// Note: the T | undefined everywhere is from https://github.com/angular/angular-cli/issues/2034

@Directive({
  selector: '[dropTarget]'
})
export class DropTargetDirective extends DndDirective {
  @Input('dropTarget') connection: DropTargetConnection | undefined;
  callHooks() {
    return this.connection.connect(c => c.dropTarget(this.elRef.nativeElement));
  }
}

@Directive({
  selector: '[dragSource]'
})
export class DragSourceDirective extends DndDirective {
  @Input('dragSource') connection: DragSourceConnection | undefined;
  @Input('dragSourceOptions') options: DragSourceOptions | undefined;
  callHooks() {
    return this.connection.connect(c => c.dragSource(this.elRef.nativeElement, this.options));
  }
}

@Directive({
  selector: '[dragPreview]',
  inputs: ['dragPreview', 'dragPreviewOptions']
})
export class DragPreviewDirective extends DndDirective {
  @Input('dragPreview') connection: DragSourceConnection | undefined;
  @Input('dragPreviewOptions') dragPreviewOptions: DragPreviewOptions | undefined;
  callHooks() {
    return this.connection.connect(c => c.dragPreview(this.elRef.nativeElement, this.dragPreviewOptions));
  }
}

// import { getEmptyImage } from 'react-dnd-html5-backend';
// we don't want to depend on the backend, so here that is, copied
let emptyImage;
export default function getEmptyImage() {
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
export class NoPreviewDirective {

  @Input('noDragPreview') connection: DragSourceConnection | undefined;
  @Input('hideCompletely') hideCompletely: boolean = false;

  @HostBinding("style.opacity") opacity: number | string;
  @HostBinding("style.height") height: number | string;

  subscription: Subscription;

  ngOnInit() {
    this.subscription = this.connection.collect(m => m.isDragging()).subscribe(isDragging => {
      if (this.hideCompletely) {
        this.opacity = isDragging ? 0 : null;
        this.height = isDragging ? 0 : null;
      }
    });
  }
  ngOnChanges() {
    this.connection.connect(c => c.dragPreview(getEmptyImage(), {
      captureDraggingState: this.hideCompletely,
    }));
  }
  ngOnDestroy() { this.subscription && this.subscription.unsubscribe() }
}
