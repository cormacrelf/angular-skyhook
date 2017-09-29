import { NgZone } from '@angular/core';
import { invariant } from './invariant';
import { DndTypeOrTypeArray } from './type-ish';
import { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER, DragDropManager } from './manager';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';


type Connector<T> = { type: T; } | { types: T };

interface FactoryArgs<TConnector, TMonitor> {
  createHandler: any;
  createMonitor: (manager: DragDropManager) => TMonitor;
  createConnector: (backend) => { hooks: TConnector };
  registerHandler: (type, handler, manager) => { handlerId: any, unregister: Subscription | Function };
}

import { Observable } from 'rxjs/Observable';

export interface Connection<T, C, M> {
  connector(): C;
  monitor<T = M>(project?: (monitor: M) => T): Observable<T>;
  setType(type: T): void;
  destroy(): void;
  destroyOn(obs: Observable<any>): void;
}

export function connectionFactory<T, TConnector, TMonitor>({
  createHandler,
  createMonitor,
  createConnector,
  registerHandler,
}: FactoryArgs<TConnector, TMonitor>): new (
  manager: DragDropManager,
  type: any,
  zone: NgZone
) => Connection<T, TConnector, TMonitor> {

  class ConnectionInner implements Connection<T, TConnector, TMonitor> {

    // immutable after instantiation
    private readonly handlerMonitor: any;
    private readonly handlerConnector: any & { hooks: any };
    private readonly handler: any;
    private readonly collector$: BehaviorSubject<TMonitor>;

    // mutable state
    private currentType: T;
    private handlerId: any;
    private subscription: Subscription;

    constructor(
      private manager: DragDropManager,
      initialType: T | undefined,
      private zone: NgZone,
    ) {

      invariant(
        typeof manager === 'object',
        // TODO: update this mini-documentation
        'Could not find the drag and drop manager in the context of %s. ' +
        'Make sure to wrap the top-level component of your app with DragDropContext. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context',
      );

      this.handlerMonitor = createMonitor(this.manager);
      this.collector$ = new BehaviorSubject<TMonitor>(this.handlerMonitor);
      this.handler = createHandler(this.handlerMonitor);
      this.handlerConnector = createConnector(this.manager.getBackend());
      if (initialType) {
        this.setType(initialType);
      }
    }

    monitor<T = TMonitor>(project?: (monitor: TMonitor) => T) {
      if (project) {
        return this.collector$.map(project).distinctUntilChanged();
      }
      return this.collector$;
    }

    connector() {
      return this.handlerConnector.hooks;
    }

    setType(type: T) {
      // make super sure. I think this is mainly a concern when creating DOM
      // event handlers, but it doesn't hurt here either.
      this.zone.runOutsideAngular(() => {
        this.receiveType(type);
      });
    }

    /** Returns the drag source ID that can be used to simulate the drag and drop events with the testing backend. */
    getHandlerId() {
      return this.handlerId;
    }

    receiveType(type: T) {
      if (type === this.currentType) {
        return;
      }

      this.currentType = type;

      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      console.log('subscribed to ' + type.toString());
      this.subscription = new Subscription();

      const { handlerId, unregister } = registerHandler(
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

