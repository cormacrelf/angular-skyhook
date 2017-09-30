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

import { invariant } from './invariant';

import { DropTargetConnection, DragSourceOptions, DragSourceConnection, DragPreviewOptions } from './connection-types'

const explanation =
  "You can only pass exactly one connection object to [dropTarget]. " +
  "There is only one of each source/target/preview allowed per DOM element."
;

@Injectable()
abstract class DndDirective implements OnChanges {
  abstract connection: any;
  constructor(protected elRef: ElementRef, private zone: NgZone) { }
  ngOnChanges() {
    invariant(typeof this.connection === 'object' && !Array.isArray(this.connection), explanation);
    this.zone.runOutsideAngular(() => {
      this.callHooks();
    })
  }
  abstract callHooks(): void;
}

// Note: the T | undefined everywhere is from https://github.com/angular/angular-cli/issues/2034

@Directive({
  selector: '[dropTarget]'
})
export class DropTargetDirective extends DndDirective {
  @Input('dropTarget') connection: DropTargetConnection | undefined;
  callHooks() {
    this.connection.connector(c => c.dropTarget(this.elRef.nativeElement));
  }
}

@Directive({
  selector: '[dragSource]'
})
export class DragSourceDirective extends DndDirective {
  @Input('dragSource') connection: DragSourceConnection | undefined;
  @Input('dragSourceOptions') options: DragSourceOptions | undefined;
  callHooks() {
    this.connection.connector(c => c.dragSource(this.elRef.nativeElement, this.options));
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
    this.connection.connector(c => c.dragPreview(this.elRef.nativeElement, this.dragPreviewOptions));
  }
}

