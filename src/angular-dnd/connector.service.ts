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
import { DndTypeOrTypeArray } from './type-ish';
import { sourceConnectionFactory, targetConnectionFactory } from './connection-factory';
import { InjectionToken } from '@angular/core';
import { DragLayerConnectionClass } from './drag-layer-connection';

import { DragSourceConnection, DropTargetConnection, DragLayerConnection } from './connection-types';

const emptyProps = {};

/** new symbol every time, so you can't accidentally make it work without
 *  setting any types */
const UNSET = () => Symbol("UNSET: call setType() on your Connection");

@Injectable()
export class DndService {
  constructor(
    @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager,
    private zone: NgZone) {
  }

  private accept(types: string|symbol|Array<string|symbol>|Iterable<string|symbol>) {
    return {
      dropTarget: (spec: DropTargetSpec) => {
        return this.dropTarget({ ...spec, types });
      }
    }
  }

  private emit(type: string|symbol) {
    return {
      dragSource: (spec: DragSourceSpec) => {
        return this.dragSource({ ...spec, type });
      }
    }
  }

  public dropTarget(spec: DropTargetSpec): DropTargetConnection {
    return this.zone.runOutsideAngular(() => {
      const createTarget = createTargetFactory(spec, this.zone);
      const Connection = targetConnectionFactory({
        createHandler: createTarget,
        registerHandler: registerTarget,
        createMonitor: createTargetMonitor,
        createConnector: createTargetConnector,
      });
      const conn = new Connection(this.manager, this.zone, spec.types || UNSET());
      return conn;
    });
  }

  public dragSource(spec: DragSourceSpec): DragSourceConnection {
    return this.zone.runOutsideAngular(() => {
      const createSource = createSourceFactory(spec, this.zone);
      const Connection = sourceConnectionFactory({
        createHandler: createSource,
        registerHandler: registerSource,
        createMonitor: createSourceMonitor,
        createConnector: createSourceConnector,
      });
      const conn = new Connection(this.manager, this.zone, spec.type || UNSET());
      return conn;
    });
  }

  public dragLayer(): DragLayerConnection {
    return new DragLayerConnectionClass(this.manager, this.zone);
  }

}

