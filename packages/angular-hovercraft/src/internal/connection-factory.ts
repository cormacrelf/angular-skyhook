/**
 * @private
 */
/** a second comment */

import { NgZone } from '@angular/core';
import { invariant } from './invariant';
import { DndTypeOrTypeArray } from '../type-ish';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TYPE_DYNAMIC } from '../tokens';

import { take, map, distinctUntilChanged, switchMapTo } from 'rxjs/operators';

import { areCollectsEqual } from '../utils/areCollectsEqual';

import { DropTargetMonitor } from '../target-monitor';
import { DragSourceMonitor } from '../source-monitor';
import * as t from '../connection-types';
import { DropTargetConnector, DragSourceConnector } from '../connectors';

export interface FactoryArgs<TMonitor, TConnector> {
  createHandler: (handlerMonitor: any) => any;
  createMonitor: (manager: any) => TMonitor;
  createConnector: (backend: any) => { receiveHandlerId(handlerId: any): void; hooks: TConnector; };
  registerHandler: (type: any, handler: any, manager: any) => { handlerId: any; unregister: Subscription | Function; };
}

export interface SourceConstructor {
  new ( manager: any, zone: NgZone, initialType: string|symbol|undefined): t.DragSource;
}
export interface TargetConstructor {
  new ( manager: any, zone: NgZone, initialType: DndTypeOrTypeArray|undefined): t.DropTarget;
}

export function sourceConnectionFactory(factoryArgs: FactoryArgs<DragSourceMonitor, DragSourceConnector>): SourceConstructor {
  return connectionFactory(factoryArgs) as SourceConstructor;
}

export function targetConnectionFactory(factoryArgs: FactoryArgs<DropTargetMonitor, DropTargetConnector>): TargetConstructor {
  return connectionFactory(factoryArgs) as TargetConstructor;
}

function connectionFactory<TMonitor extends DragSourceMonitor | DropTargetMonitor, TConnector>(factoryArgs: FactoryArgs<TMonitor, TConnector>) {

  class ConnectionInner<T> {

    // immutable after instantiation
    private readonly handlerMonitor: any;
    private readonly handlerConnector: any & { hooks: any };
    private readonly handler: any;

    /** The stream of all change events from the internal subscription's handleChange */
    private readonly collector$ = new ReplaySubject<TMonitor>(1);
    /** A subject basically used to kick off any observables waiting for a type to be set via setType/setTypes */
    private readonly resolvedType$ = new ReplaySubject<any>(1);

    // mutable state
    private currentType: DndTypeOrTypeArray;
    private handlerId: any;

    /**
     * This one is created and destroyed once per type or list of types.
     * Because each time we change the type, we unsubscribe from the global state storage and
     * re-subscribe with the new type.
     */
    private subscriptionTypeLifetime: Subscription;

    /**
     * This one lives exactly as long as the connection.
     * It is responsible for disposing of the handlerConnector, and any internal listen() subscriptions.
     */
    private subscriptionConnectionLifetime = new Subscription();

    constructor(
      private manager: any,
      private zone: NgZone,
      initialType: DndTypeOrTypeArray | undefined,
    ) {

      invariant(
        typeof manager === 'object',
        // TODO: update this mini-documentation
        'Could not find the drag and drop manager in the context of %s. ' +
        'Make sure to wrap the top-level component of your app with DragDropContext. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context',
      );

      this.handlerMonitor = factoryArgs.createMonitor(this.manager);
      this.collector$.next(this.handlerMonitor);
      this.handler = factoryArgs.createHandler(this.handlerMonitor);
      this.handlerConnector = factoryArgs.createConnector(this.manager.getBackend());
      // handlerConnector lives longer than any per-type subscription
      this.subscriptionConnectionLifetime.add(() => this.handlerConnector.receiveHandlerId(null));

      if (initialType && initialType !== TYPE_DYNAMIC) {
        this.setTypes(initialType);
      }
    }

    listen<P>(mapFn: (monitor: TMonitor) => P): Observable<P> {
      // Why does it have to be a ReplaySubject? I don't know, but it works.
      var subj = new ReplaySubject<P>(1);
      // Listeners are generally around as long as the connection.
      // This isn't 100% true, but there is no way of knowing (even if you ref-count it)
      // when a component no longer needs it.
      this.subscriptionConnectionLifetime.add(
        this.resolvedType$.pipe(
          // this ensures we don't start emitting values until there is a type resolved
          take(1),
          // switch our attention to the incoming firehose of 'something changed' events
          switchMapTo(this.collector$),
          // turn them into 'interesting state' via the monitor and a user-provided function
          map(mapFn),
          // don't emit EVERY time the firehose says something changed, only when the interesting state changes
          distinctUntilChanged(areCollectsEqual)
        ).subscribe(p => {
          // Firstly, this entire object in general runs outside change detection.
          // Any change detection has to be triggered manually. If you don't, the component instance
          // will receive new values and all, but won't update the DOM.
          // Recall that NgZone.run(f) will:
          //   1. perform f
          //   2. save the return value if any
          //   3. perform change detection (appears as `onLeave` in the flame graph, because the thread of execution is leaving the zone)
          //   4. return the return value from run().
          // We are returning a subject because we want that zone.run to trigger change detection (step 3) _after_
          // the component has received the latest value.
          // This way, subj.next(p) pushes a new value onto any |async or other subscribers, and then we manually
          // trigger a change detector cycle, which picks up the new value.
          this.zone.run(() => {
            subj.next(p);
          });
        })
      );
      return subj;
    }

    connect(fn: (connector: TConnector) => void): Subscription {
      return this.resolvedType$.pipe(take(1)).subscribe(() => {
        // outside because we want the event handlers set up inside fn to
        // fire outside the zone
        this.zone.runOutsideAngular(() => {
          fn(this.handlerConnector.hooks);
        });
      })
    }

    setTypes(type: DndTypeOrTypeArray) {
      // make super sure. I think this is mainly a concern when creating DOM
      // event handlers, but it doesn't hurt here either.
      this.zone.runOutsideAngular(() => {
        this.receiveType(type);
        this.resolvedType$.next(1);
      });
    }

    setType(type: string|symbol) {
      this.setTypes(type);
    }

    /** Returns the drag source ID that can be used to simulate the drag and drop events with the testing backend. */
    getHandlerId() {
      return this.handlerId;
    }

    receiveType(type: DndTypeOrTypeArray) {
      if (type === this.currentType) {
        return;
      }

      this.currentType = type;

      if (this.subscriptionTypeLifetime) {
        this.subscriptionTypeLifetime.unsubscribe();
      }
      // console.log('subscribed to ' + type.toString());
      this.subscriptionTypeLifetime = new Subscription();

      const { handlerId, unregister } = factoryArgs.registerHandler(
        type,
        this.handler,
        this.manager,
      );

      this.handlerId = handlerId;
      this.handlerMonitor.receiveHandlerId(handlerId);
      this.handlerConnector.receiveHandlerId(handlerId);

      const globalMonitor = this.manager.getMonitor();
      const unsubscribe: Subscription = globalMonitor.subscribeToStateChange(
        this.handleChange,
        { handlerIds: [handlerId] },
      );

      this.subscriptionTypeLifetime.add(unsubscribe);
      this.subscriptionTypeLifetime.add(unregister);
      // this.subscription.add(() => console.log("unsubscribed from " + type.toString()));
    }

    private handleChange = () => {
      this.collector$.next(this.handlerMonitor);
    }

    unsubscribe() {
      this.subscriptionTypeLifetime && this.subscriptionTypeLifetime.unsubscribe();
      this.subscriptionConnectionLifetime.unsubscribe();
    }

    get closed() {
      return this.subscriptionConnectionLifetime && this.subscriptionConnectionLifetime.closed;
    }

  }
  return ConnectionInner;
}

