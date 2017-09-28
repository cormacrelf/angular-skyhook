import { invariant } from './invariant';
import { Injectable, Inject, ElementRef, NgZone } from '@angular/core';
import { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER, DragDropManager } from './manager';

import { DropTargetSpec, createTargetFactory } from './drop-target';
import { DropTargetMonitor, createTargetMonitor } from './target-monitor';
import createTargetConnector from './createTargetConnector';
import registerTarget from './register-target';

import { DragSourceSpec, createSourceFactory } from './drag-source';
import { DragSourceMonitor, createSourceMonitor } from './source-monitor';
import createSourceConnector from './createSourceConnector';
import registerSource from './register-source';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TypeIsh, TypeIshOrFunction } from './type-ish';
import { connectionFactory } from './connection';
import { InjectionToken } from '@angular/core';

export interface DropTargetConnector {
  dropTarget  ( elementRef: ElementRef, options?: Object): void;
}

export interface DragSourceConnector {
  dragSource  ( elementRef: ElementRef, options?: Object): void
  dragPreview ( elementRef: ElementRef, options?: Object): void;
}

import { Connection } from './connection';

export type DropTargetConnection = Connection<DropTargetConnector, DropTargetMonitor>;
export type DragSourceConnection = Connection<DragSourceConnector, DragSourceMonitor>;

const emptyProps = {};

@Injectable()
export class DndConnectorService {
  constructor(
    @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager,
    private zone: NgZone) {
  }

  public accept(t: TypeIsh) {
    return { dropTarget: (spec: DropTargetSpec, options?) => this.dropTarget(spec, t, options) }
  }

  public emit(t: string) {
    return { dragSource: (spec: DragSourceSpec, options?) => this.dragSource(spec, t, options) }
  }

  dropTarget(
    spec: DropTargetSpec,
    type: TypeIsh = [],
    options = {}
  ): DropTargetConnection {
    return this.zone.runOutsideAngular(() => {
      const createTarget = createTargetFactory(spec, this.zone);
      const getType = typeof type === 'function' ? type : () => type;
      const Connection = connectionFactory<DropTargetConnector, DropTargetMonitor>({
        createHandler: createTarget,
        registerHandler: registerTarget,
        createMonitor: createTargetMonitor,
        createConnector: createTargetConnector,
        getType,
        options,
      });
      const conn = new Connection(this.manager, type, this.zone);
      return conn;
    });
  }

  public dragSource(
    spec: DragSourceSpec,
    type: string = Symbol("UNSET") as any,
    options = {}
  ): DragSourceConnection {
    return this.zone.runOutsideAngular(() => {
      const createSource = createSourceFactory(spec, this.zone);
      const getType = typeof type === 'function' ? type : () => type;
      const Connection = connectionFactory<DragSourceConnector, DragSourceMonitor>({
        createHandler: createSource,
        registerHandler: registerSource,
        createMonitor: createSourceMonitor,
        createConnector: createSourceConnector,
        getType,
        options,
      });
      const conn = new Connection(this.manager, type, this.zone);
      return conn;
    });
  }

}

