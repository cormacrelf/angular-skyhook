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

import { DRAG_DROP_MANAGER, DragDropManager } from './manager';
import { DndTypeOrTypeArray } from './type-ish';

import { DropTargetConnection, DragSourceOptions, DragSourceConnection, DragPreviewOptions } from './connector.service'

import { Connection } from './connection';

@Injectable()
abstract class DndDirective implements OnChanges {
  abstract connection: Connection<any, any, any>;
  constructor(protected elRef: ElementRef, private zone: NgZone) { }
  ngOnChanges() {
    invariant(typeof this.connection === 'object' && !Array.isArray(this.connection), explanation);
    this.zone.runOutsideAngular(() => {
      this.callHooks();
    })
  }
  abstract callHooks(): void;
}

const explanation =
  "You can only pass exactly one Connection object to [dropTarget]. " +
  "There is only one of each source/target/preview allowed per DOM element."
;

// Note: the T | undefined everywhere is https://github.com/angular/angular-cli/issues/2034

@Directive({
  selector: '[dropTarget]'
})
export class DropTargetDirective extends DndDirective {
  @Input('dropTarget') connection: DropTargetConnection | undefined;
  callHooks() {
    this.connection.connector().dropTarget(this.elRef.nativeElement);
  }
}

@Directive({
  selector: '[dragSource]'
})
export class DragSourceDirective extends DndDirective {
  @Input('dragSource') connection: DragSourceConnection | undefined;
  @Input('dragSourceOptions') options: DragSourceOptions | undefined;
  callHooks() {
    this.connection.connector().dragSource(this.elRef.nativeElement, this.options);
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
    this.connection.connector().dragPreview(this.elRef.nativeElement, this.dragPreviewOptions);
  }
}

