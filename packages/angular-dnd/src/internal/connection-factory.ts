import { NgZone } from '@angular/core';
import { invariant } from './invariant';
import { DndTypeOrTypeArray } from '../type-ish';
import { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER, DragDropManager } from './manager';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { areCollectsEqual } from '../utils/areCollectsEqual';

import { DropTargetMonitor } from '../target-monitor';
import { DragSourceMonitor } from '../source-monitor';
import * as t from '../connection-types';
import { DropTargetConnector, DragSourceConnector } from '../connectors';

interface FactoryArgs<TMonitor, TConnector> {
  createHandler: (handlerMonitor) => any;
  createMonitor: (manager: DragDropManager) => TMonitor;
  createConnector: (backend: any) => { hooks: TConnector };
  registerHandler: (type, handler, manager) => { handlerId: any, unregister: Subscription | Function };
}

interface SourceConstructor {
  new ( manager: DragDropManager, zone: NgZone, initialType: string|symbol): t.DragSource;
}
interface TargetConstructor {
  new ( manager: DragDropManager, zone: NgZone, initialType: DndTypeOrTypeArray): t.DropTarget;
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
    private readonly collector$ = new ReplaySubject<TMonitor>(1);
    private readonly resolvedType$ = new ReplaySubject<any>(1);

    // mutable state
    private currentType: DndTypeOrTypeArray;
    private handlerId: any;
    private subscription: Subscription;

    constructor(
      private manager: DragDropManager,
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
      if (initialType) {
        this.setTypes(initialType);
      }
    }

    collect<P>(mapFn: (monitor: TMonitor) => P): Observable<P> {
      // defers any calling of monitor.X until we have resolved a type
      return this.resolvedType$.take(1).switchMapTo(this.collector$).map(mapFn).distinctUntilChanged(areCollectsEqual);
    }

    connect(fn: (connector: TConnector) => void): Subscription {
      return this.resolvedType$.take(1).subscribe(() => {
        this.zone.runOutsideAngular(() => {
          fn(this.handlerConnector.hooks);
        });
      })
    }

    setTypes(type: DndTypeOrTypeArray) {
      // make super sure. I think this is mainly a concern when creating DOM
      // event handlers, but it doesn't hurt here either.
      this.zone.runOutsideAngular(() => {
        this.resolvedType$.next(1);
        this.receiveType(type);
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

      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      // console.log('subscribed to ' + type.toString());
      this.subscription = new Subscription();

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

      this.subscription.add(unsubscribe);
      this.subscription.add(unregister);
      // this.subscription.add(() => console.log("unsubscribed from " + type.toString()));
    }

    private handleChange = () => {
      this.zone.run(() => {
        this.collector$.next(this.handlerMonitor);
      });
    }

    /**
     * Dies when obs fires.
     *
     * Use with the `destroy$: Subject()` / `ngOnDestroy() { this.destroy$.next() }` pattern.
     * */
    destroyOn(obs: Observable<any>) {
      // auto-unsubscribe from obs using take(1)
      const deathSubscription = obs.take(1).subscribe();
      // pass a function to call when it dies
      deathSubscription.add(() => this.destroy());
      return this;
    }

    destroy() {
      this.subscription.unsubscribe();
      // handlerConnector lives longer than any individual subscription so kill
      // it here instead of attaching to subscription.add()
      this.handlerConnector.receiveHandlerId(null);
    }

  }
  return ConnectionInner;
}

