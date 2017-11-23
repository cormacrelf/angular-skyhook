/**
 * @module 1-Top-Level
 */
/** a second comment */

import { invariant } from "./internal/invariant";
import { Injectable, Inject, ElementRef, NgZone } from "@angular/core";
import { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER } from "./tokens";

import { DropTargetSpec } from "./drop-target";
import { DropTargetMonitor } from "./target-monitor";
import createTargetConnector from "./internal/createTargetConnector";
import registerTarget from "./internal/register-target";

import { DragSourceSpec } from "./drag-source";
import { DragSourceMonitor } from "./source-monitor";
import createSourceConnector from "./internal/createSourceConnector";
import registerSource from "./internal/register-source";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DndTypeOrTypeArray } from "./type-ish";
import { sourceConnectionFactory, targetConnectionFactory } from "./internal/connection-factory";
import { InjectionToken } from "@angular/core";
import { DragLayerConnectionClass } from "./internal/drag-layer-connection";

import { DragSource, DropTarget, DragLayer } from "./connection-types";
import { createSourceMonitor } from "./internal/createSourceMonitor";
import { createTargetFactory } from "./internal/createTargetFactory";
import { createTargetMonitor } from "./internal/createTargetMonitor";
import { createSourceFactory } from "./internal/createSourceFactory";

/** If your components have lots of subscriptions, it can get tedious having to
 *  unsubscribe from all of them. A common pattern is to create an RxJS Subject
 *  called `destroy$`, to use `Observable.takeUntil(destroy$).subscribe(...)`
 *  and to call `destroy.next()` once to clean up all of them. __PackageName__
 *  supports this pattern with by using the `takeUntil` parameter on the
 *  constructors. Simply:
 *
 * ```typescript
 * destroy$ = new Subject<void>();
 * target = this.dnd.dropTarget({
 *   // ...
 * }, destroy$);
 * ngOnDestroy() { this.destroy$.next() }
 * ```
 *
 * It looks much cleaner when there are four other
 * `.takeUntil(this.destroy$).subscribe()` calls in `ngOnInit`.
 */

@Injectable()
export class DndService {
  constructor(
    @Inject(DRAG_DROP_MANAGER) private manager: any,
    private zone: NgZone) {
  }

  /**
   */
  public dropTarget(spec: DropTargetSpec, takeUntil?: Observable<any>): DropTarget {
    return this.zone.runOutsideAngular(() => {
      const createTarget: any = createTargetFactory(spec, this.zone);
      const Connection: any = targetConnectionFactory({
        createHandler: createTarget,
        registerHandler: registerTarget,
        createMonitor: createTargetMonitor,
        createConnector: createTargetConnector,
      });
      const conn: any = new Connection(this.manager, this.zone, spec.types);
      if (takeUntil) {
        takeUntil.take(1).subscribe(() => conn.destroy());
      }
      return conn;
    });
  }

  /** This method creates a [[DragSource]] object
   *
   * @param takeUntil See [[DndService]]
   */

  public dragSource(spec: DragSourceSpec, takeUntil?: Observable<any>): DragSource {
    return this.zone.runOutsideAngular(() => {
      const createSource = createSourceFactory(spec, this.zone);
      const Connection = sourceConnectionFactory({
        createHandler: createSource,
        registerHandler: registerSource,
        createMonitor: createSourceMonitor,
        createConnector: createSourceConnector,
      });
      const conn = new Connection(this.manager, this.zone, spec.type);
      if (takeUntil) takeUntil.take(1).subscribe(() => conn.destroy());
      return conn;
    });
  }

  /**
   * This method creates a [[DragLayer]] object
   */
  public dragLayer(takeUntil?: Observable<any>): DragLayer {
    return this.zone.runOutsideAngular(() => {
      const conn = new DragLayerConnectionClass(this.manager, this.zone);
      if (takeUntil) takeUntil.take(1).subscribe(() => conn.destroy());
      return conn;
    });
  }

}

