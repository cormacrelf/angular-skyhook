import { NgZone } from '@angular/core';
import { invariant } from './invariant';
import { TypeIsh } from './type-ish';
import { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER, DragDropManager } from './manager';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';


interface FactoryArgs<TConnector, TMonitor> {
  createHandler: any;
  createMonitor: (manager: DragDropManager) => TMonitor;
  createConnector: (backend) => { hooks: TConnector };
  registerHandler: (type, handler, manager) => { handlerId: any, unregister: Subscription | Function };
  getType: (props?: Object) => TypeIsh;
  // collect: any;
  options: any;
}

import { Observable } from 'rxjs/Observable';

export interface Connection<C, M> {
  connector(): C;
  collect(): Observable<M>;
  setType(type: TypeIsh): void;
  destroy(): void;
  destroyOn(obs: Observable<any>): void;
  options(): Object;
}

export function connectionFactory<TConnector,TMonitor>({
  createHandler,
  createMonitor,
  createConnector,
  registerHandler,
  getType,
  // collect,
  options,
}: FactoryArgs<TConnector, TMonitor>): new (
  manager: DragDropManager,
  props: Object,
  zone: NgZone
) => Connection<TConnector, TMonitor> {

  class ConnectionInner implements Connection<TConnector, TMonitor> {

    options() {
      return options;
    }

    private handlerMonitor: any;
    private handlerConnector: any & { hooks: any };
    private handler: any;

    private collector$: BehaviorSubject<TMonitor>;

    // mutable state
    private currentType: TypeIsh;
    private handlerId: any;
    subscription = new Subscription();

    constructor(
      private manager: DragDropManager,
      type: TypeIsh,
      // private type$: BehaviorSubject<TypeIsh>,
      private zone: NgZone
    ) {

      invariant(
        typeof manager === 'object',
        'Could not find the drag and drop manager in the context of %s. ' +
        'Make sure to wrap the top-level component of your app with DragDropContext. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context',
      );

      this.zone.runOutsideAngular(() => {
        this.handlerMonitor = createMonitor(this.manager);
        this.collector$ = new BehaviorSubject<TMonitor>(this.handlerMonitor);
        this.handler = createHandler(this.handlerMonitor);
        this.handlerConnector = createConnector(this.manager.getBackend());
        this.setType(type);
      })
    }

    private receiveProps(props: Object) {
      this.setType(getType(props));
    }

    collect() {
      return this.collector$;
    }

    connector() {
      return this.handlerConnector.hooks;
    }

    setType(type) {
      if (type === this.currentType) {
        return;
      }

      this.currentType = type;

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
      this.subscription.add(() => this.handlerConnector.receiveHandlerId(null));
    }

    private handleChange = () => {
      this.zone.run(() => {
        this.collector$.next(this.handlerMonitor);
      });
    }

    /**
     * Dies when obs fires.
     *
     * Use with `destroy$: Subject()` and `ngOnDestroy() { this.destroy$.next() }`
     * */
    destroyOn(obs: Observable<any>) {
      const subs = this.subscription;
      this.subscription = obs.take(1).subscribe(
      );
      this.subscription.add(subs);
    }

    destroy() {
      this.subscription.unsubscribe();
    }

  }
  return ConnectionInner;
}

