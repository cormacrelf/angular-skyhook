/**
 * @module 1-Top-Level
 */
/** a second comment */

/// <reference types="zone.js" />
import {
    Injectable,
    Inject,
    NgZone,
} from "@angular/core";
import { TYPE_DYNAMIC, DRAG_DROP_MANAGER } from "./tokens";
import { DragDropManager } from "dnd-core";

import { DropTargetSpec } from "./drop-target-specification";
import createTargetConnector from "./internal/createTargetConnector";
import registerTarget from "./internal/register-target";

import { DragSourceSpec } from "./drag-source-specification";
import createSourceConnector from "./internal/createSourceConnector";
import registerSource from "./internal/register-source";

import {
    SubscriptionLike,
    TeardownLogic
} from "rxjs";
import { TypeOrTypeArray } from "./type-ish";
import {
    // sourceConnectionFactory,
    // targetConnectionFactory,
    SourceConnection,
    TargetConnection
} from "./internal/connection-factory";
import { DragLayerConnectionClass } from "./internal/drag-layer-connection";

import { DragSource, DropTarget, DragLayer } from "./connection-types";
import { createSourceMonitor } from "./internal/createSourceMonitor";
import { createTargetFactory } from "./internal/createTargetFactory";
import { createTargetMonitor } from "./internal/createTargetMonitor";
import { createSourceFactory } from "./internal/createSourceFactory";

/**
 * Represents an RxJS Subscription, with multi-version compatibility.
 * The standard SubscriptionLike does not contain an add() method.
 */
export interface AddSubscription extends SubscriptionLike {
    /** Same as RxJS `Subscription#add` */
    add(teardownLogic: TeardownLogic): AddSubscription;
}

/** For a simple component, unsubscribing is as easy as `connection.unsubscribe()` in `ngOnDestroy()`
 *  If your components have lots of subscriptions, it can get tedious having to
 *  unsubscribe from all of them, and you might forget. A common pattern is to create an RxJS Subscription
 *  (maybe called `destroy`), to use `this.destroy.add(xxx.subscribe(...))`
 *  and to call `destroy.unsubscribe()` once to clean up all of them. @angular-skyhook/core
 *  supports this pattern with by using the `subscription` parameter on the
 *  constructors. Simply:
 *
```typescript
import { Subscription } from 'rxjs';
// ...
destroy = new Subscription();
target = this.dnd.dropTarget({
  // ...
}, this.destroy);
ngOnDestroy() { this.destroy.unsubscribe(); }
```
 *
 * It is a good habit for avoiding leaked subscriptions, because .
 */

@Injectable()
export class SkyhookDndService {
    /** @ignore */
    private skyhookZone: Zone = Zone.root.fork({
        name: "skyhookZone",
        onHasTask: (_parentZoneDelegate, _currentZone, _targetZone, state) => {
            // when we've | drained the microTask queue; or                    | ... run a change detection cycle.
            //            | executed or cancelled a macroTask (eg a timer); or |
            //            | handled an event                                   |

            // note: we must use ngZone.run() instead of ApplicationRef.tick()
            // this is because
            // 1. this callback runs outside the angular zone
            // 2. therefore if you use appRef.tick(), the event handlers set up during the tick() are
            //    not in the angular zone, even though anything set up during tick() should be
            // 3. therefore you get regular (click) handlers from templates running in skyhookZone
            //    and not causing change detection

            // Also, now we watch for macroTasks as well.
            // This means if we set up timers in the skyhook zone, they will fire and cause change
            // detection. Useful if doing .listen(...).delay(1000) and the resulting asynchronous
            // subscribers.
            // Appropriately, we run more setup handlers in skyhookZone now.
            //
            // Proper event handlers (set up by the backend) don't trigger any, because skyhookZone
            // only cares about # of handlers changing => 0. But if we care about them, it will be
            // through listen(), updates to which will schedule a microTask.

            if (!state[state.change]) {
                this.ngZone.run(() => {
                    // noop, but causes change detection (i.e. onLeave)
                });
            }
        }
        // onInvokeTask: (zoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) => {
        // }
        // onScheduleTask(parentZoneDelegate, currentZone, targetZone, task) {
        //   return parentZoneDelegate.scheduleTask(targetZone, task);
        // },
        // onInvoke: (parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) => {
        // }
    });

    /** @ignore */
    constructor(
        @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager,
        private ngZone: NgZone
    ) { }

    /**
     * This drop target will only react to the items produced by the drag sources
     * of the specified type or types.
     *
     * If you want a dynamic type, pass `null` as the type; and call
     * {@link DropTarget#setTypes} in a lifecycle hook.
     */
    public dropTarget<
        Item = {},
        DropResult = {}
        >(
            types: TypeOrTypeArray | null,
            spec: DropTargetSpec<Item, DropResult>,
            subscription?: AddSubscription
        ): DropTarget<Item, DropResult> {
            // return this.ngZone.runOutsideAngular(() => {
            return this.skyhookZone.run(() => {
                const createTarget: any = createTargetFactory(spec, this.skyhookZone);

                const conn: any = new TargetConnection(
                    {
                        createHandler: createTarget,
                        registerHandler: registerTarget,
                        createMonitor: createTargetMonitor,
                        createConnector: createTargetConnector
                    },
                    this.manager,
                    this.skyhookZone,
                    types || TYPE_DYNAMIC
                );

                if (subscription) {
                    subscription.add(conn);
                }
                return conn;
            });
        }

    /** This method creates a {@link DragSource} object. It represents a drag
     *  source and its behaviour, and can be connected to a DOM element by
     *  assigning it to the `[dragSource]` directive on that element in your
     *  template.
     *
     * It is the corollary of [`react-dnd`'s
     * `DragSource`](http://react-dnd.github.io/react-dnd/docs-drag-source.html).
     *
     * The `spec` argument ({@link DragSourceSpec}) is a set of _queries_ and
     * _callbacks_ that are called at appropriate times by the internals. The
     * queries are for asking your component whether to drag/listen and what
     * item data to hoist up; the callback (just 1) is for notifying you when
     * the drag ends.
     *
     * Only the drop targets registered for the same type will
     * react to the items produced by this drag source. If you want a dynamic
     * type, pass `null` as the type; and call {@link DragSource#setType} in
     * a lifecycle hook.
     *
     * @param subscription An RxJS Subscription to tie the lifetime of the
     * connection to.
     */

    public dragSource<
        Item,
        DropResult = {}
        >(
            type: string | symbol | null,
            spec: DragSourceSpec<Item, DropResult>,
            subscription?: AddSubscription
        ): DragSource<Item, DropResult> {
            // return this.ngZone.runOutsideAngular(() => {
            return this.skyhookZone.run(() => {
                const createSource = createSourceFactory(spec, this.skyhookZone);
                const conn = new SourceConnection(
                    {
                        createHandler: createSource,
                        registerHandler: registerSource,
                        createMonitor: createSourceMonitor,
                        createConnector: createSourceConnector
                    },
                    this.manager,
                    this.skyhookZone,
                    type || TYPE_DYNAMIC
                );
                if (subscription) {
                    subscription.add(conn);
                }
                return conn;
            });
        }

    /**
     * This method creates a {@link DragLayer} object
     */
    public dragLayer<Item = any>(subscription?: AddSubscription): DragLayer<Item> {
        // return this.ngZone.runOutsideAngular(() => {
        return this.skyhookZone.run(() => {
            const conn = new DragLayerConnectionClass(this.manager, this.skyhookZone);
            if (subscription) {
                subscription.add(conn);
            }
            return conn;
        });
    }
}
