/**
 * @module 1-Top-Level
 */
/** a second comment */

import { invariant } from "./internal/invariant";
import { Injectable, Inject, ElementRef, NgZone } from "@angular/core";
import { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER } from "./tokens";

import { DropTargetSpec } from "./drop-target-spec";
import { DropTargetMonitor } from "./target-monitor";
import createTargetConnector from "./internal/createTargetConnector";
import registerTarget from "./internal/register-target";

import { DragSourceSpec } from "./drag-source-spec";
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
import { Subscription } from "rxjs/Subscription";

/** For a simple component, unsubscribing is as easy as `connection.unsubscribe()` in `ngOnDestroy()`
 *  If your components have lots of subscriptions, it can get tedious having to
 *  unsubscribe from all of them, and you might forget. A common pattern is to create an RxJS Subscription
 *  (maybe called `destroy`), to use `this.destroy.add(xxx.subscribe(...))`
 *  and to call `destroy.unsubscribe()` once to clean up all of them. __PackageName__
 *  supports this pattern with by using the `subscription` parameter on the
 *  constructors. Simply:
 *
 * ```typescript
 * import { Subscription } from 'rxjs/Subscription';
 * // ...
 * destroy = new Subscription();
 * target = this.dnd.dropTarget({
 *   // ...
 * }, this.destroy);
 * ngOnDestroy() { this.destroy.unsubscribe(); }
 * ```
 *
 * It is a good habit for avoiding leaked subscriptions, because .
 */

@Injectable()
export class DndService {
  constructor( @Inject(DRAG_DROP_MANAGER) private manager: any, private zone: NgZone) { }

  /**
   */
  public dropTarget(spec: DropTargetSpec, subscription?: Subscription): DropTarget {
    return this.zone.runOutsideAngular(() => {
      const createTarget: any = createTargetFactory(spec, this.zone);
      const Connection: any = targetConnectionFactory({
        createHandler: createTarget,
        registerHandler: registerTarget,
        createMonitor: createTargetMonitor,
        createConnector: createTargetConnector,
      });
      const conn: any = new Connection(this.manager, this.zone, spec.types);
      if (subscription) {
        subscription.add(conn);
      }
      return conn;
    });
  }

  /**
   * This method creates a [[DragSource]] object. It represents a drag source
   * and its behaviour, and can be connected to a DOM element by assigning it to
   * the `[dragSource]` directive on that element in your template.
   *
   * It is the corollary of [`react-dnd`'s
   * `DragSource`](http://react-dnd.github.io/react-dnd/docs-drag-source.html).
   *
   * The `spec` argument ([[DragSourceSpec]]) is a set of _queries_ and
   * _callbacks_ that are called at appropriate times by the internals. The
   * queries are for asking your component whether to drag/listen and what item
   * data to hoist up; the callback (just 1) is for notifying you when the drag
   * ends.
   *
   * @param takeUntil See [[DndService]]
   */

  public dragSource(spec: DragSourceSpec, subscription?: Subscription): DragSource {
    return this.zone.runOutsideAngular(() => {
      const createSource = createSourceFactory(spec, this.zone);
      const Connection = sourceConnectionFactory({
        createHandler: createSource,
        registerHandler: registerSource,
        createMonitor: createSourceMonitor,
        createConnector: createSourceConnector,
      });
      const conn = new Connection(this.manager, this.zone, spec.type);
      if (subscription) {
        subscription.add(conn);
      }
      return conn;
    });
  }

  /**
   * This method creates a [[DragLayer]] object
   */
  public dragLayer(subscription?: Subscription): DragLayer {
    return this.zone.runOutsideAngular(() => {
      const conn = new DragLayerConnectionClass(this.manager, this.zone);
      if (subscription) {
        subscription.add(conn);
      }
      return conn;
    });
  }

}

