/**
 * @ignore
 */
/** a second comment */

import { Backend, DragDropManager } from 'dnd-core';
import { NgZone } from '@angular/core';
import { invariant } from './invariant';
import { TypeOrTypeArray } from '../type-ish';
import {
    Subscription,
    Observable,
    ReplaySubject,
    BehaviorSubject,
    TeardownLogic
} from 'rxjs';
import { TYPE_DYNAMIC } from '../tokens';

import { take, map, distinctUntilChanged, switchMapTo } from 'rxjs/operators';

import { areCollectsEqual } from '../utils/areCollectsEqual';

import { DropTargetMonitor } from '../target-monitor';
import { DragSourceMonitor } from '../source-monitor';
import * as t from '../connection-types';
import {
    DropTargetConnector,
    DragSourceConnector,
    DragSourceOptions,
    DragPreviewOptions
} from '../connectors';
import { scheduleMicroTaskAfter } from './scheduleMicroTaskAfter';

export interface FactoryArgs<TMonitor, TConnector> {
    createHandler: (handlerMonitor: any) => any;
    createMonitor: (manager: DragDropManager<any>) => TMonitor;
    createConnector: (
        backend: Backend
    ) => { receiveHandlerId(handlerId: any): void; hooks: TConnector };
    registerHandler: (
        type: any,
        handler: any,
        manager: DragDropManager<any>
    ) => {
        handlerId: any;
        unregister: Subscription | Function;
    };
}

export interface SourceConstructor {
    new (
        manager: any,
        ngZone: NgZone,
        skyhookZone: Zone,
        initialType: string | symbol | undefined
    ): t.DragSource<any>;
}
export interface TargetConstructor {
    new (
        manager: any,
        ngZone: NgZone,
        skyhookZone: Zone,
        initialType: TypeOrTypeArray | undefined
    ): t.DropTarget;
}

export function sourceConnectionFactory(
    factoryArgs: FactoryArgs<DragSourceMonitor, DragSourceConnector>
): SourceConstructor {
    return connectionFactory(factoryArgs) as SourceConstructor;
}

export function targetConnectionFactory(
    factoryArgs: FactoryArgs<DropTargetMonitor, DropTargetConnector>
): TargetConstructor {
    return connectionFactory(factoryArgs) as TargetConstructor;
}

function connectionFactory<
    TMonitor extends DragSourceMonitor | DropTargetMonitor,
    TConnector
>(factoryArgs: FactoryArgs<TMonitor, TConnector>) {
    class ConnectionInner<T> {
        // immutable after instantiation
        private readonly handlerMonitor: any;
        private readonly handlerConnector: any & { hooks: any };
        private readonly handler: any;

        /** The stream of all change events from the internal subscription's handleChange */
        private readonly collector$: BehaviorSubject<TMonitor>;
        /** A subject basically used to kick off any observables waiting for a type to be set via setType/setTypes */
        private readonly resolvedType$ = new ReplaySubject<any>(1);

        // mutable state
        private currentType: TypeOrTypeArray;
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
            private manager: DragDropManager<any>,
            private ngZone: NgZone,
            private skyhookZone: Zone,
            initialType: TypeOrTypeArray | undefined
        ) {
            invariant(
                typeof manager === 'object',
                // TODO: update this mini-documentation
                'Could not find the drag and drop manager in the context of %s. ' +
                    'Make sure to wrap the top-level component of your app with DragDropContext. '
                // tslint:disable-next-line:max-line-length
                // 'Read more: ',
            );
            NgZone.assertNotInAngularZone();

            this.handlerMonitor = factoryArgs.createMonitor(this.manager);
            this.collector$ = new BehaviorSubject(this.handlerMonitor);
            this.handler = factoryArgs.createHandler(this.handlerMonitor);
            this.handlerConnector = factoryArgs.createConnector(
                this.manager.getBackend()
            );
            // handlerConnector lives longer than any per-type subscription
            this.subscriptionConnectionLifetime.add(() =>
                this.handlerConnector.receiveHandlerId(null)
            );

            if (initialType && initialType !== TYPE_DYNAMIC) {
                this.setTypes(initialType);
            }
        }

        listen<P>(mapFn: (monitor: TMonitor) => P): Observable<P> {
            // Listeners are generally around as long as the connection.
            // This isn't 100% true, but there is no way of knowing (even if you ref-count it)
            // when a component no longer needs it.
            return this.resolvedType$.pipe(
                // this ensures we don't start emitting values until there is a type resolved
                take(1),
                // switch our attention to the incoming firehose of 'something changed' events
                switchMapTo(this.collector$),
                // turn them into 'interesting state' via the monitor and a user-provided function
                map(mapFn),
                // don't emit EVERY time the firehose says something changed, only when the interesting state changes
                distinctUntilChanged(areCollectsEqual),
                // this schedules a single batch change detection run after all the listeners have heard their newest value
                // thus all changes resulting from subscriptions to this are caught by the
                // change detector.
                scheduleMicroTaskAfter(this.skyhookZone)
            );
        }

        connect(fn: (connector: TConnector) => void): Subscription {
            return this.resolvedType$.pipe(take(1)).subscribe(() => {
                // must run inside skyhookZone, so things like timers firing after a long hover with touch backend
                // will cause change detection (via executing a macro or event task)
                this.skyhookZone.run(() => {
                    fn(this.handlerConnector.hooks);
                });
            });
        }

        connectDropTarget(node: Node): Subscription {
            return this.connect(c =>
                ((c as any) as DropTargetConnector).dropTarget(node)
            );
        }

        connectDragSource(
            node: Node,
            options: DragSourceOptions
        ): Subscription {
            return this.connect(c =>
                ((c as any) as DragSourceConnector).dragSource(node, options)
            );
        }

        connectDragPreview(
            node: Node,
            options: DragPreviewOptions
        ): Subscription {
            return this.connect(c =>
                ((c as any) as DragSourceConnector).dragPreview(node, options)
            );
        }

        setTypes(type: TypeOrTypeArray) {
            // must run inside skyhookZone, so things like timers firing after a long hover with touch backend
            // will cause change detection (via executing a macro or event task)
            this.skyhookZone.run(() => {
                this.receiveType(type);
                this.resolvedType$.next(1);
            });
        }

        setType(type: string | symbol) {
            this.setTypes(type);
        }

        getHandlerId() {
            return this.handlerId;
        }

        receiveType(type: TypeOrTypeArray) {
            if (type === this.currentType) {
                return;
            }

            NgZone.assertNotInAngularZone();

            this.currentType = type;

            if (this.subscriptionTypeLifetime) {
                this.subscriptionTypeLifetime.unsubscribe();
            }
            // console.debug('subscribed to ' + type.toString());
            this.subscriptionTypeLifetime = new Subscription();

            const { handlerId, unregister } = factoryArgs.registerHandler(
                type,
                this.handler,
                this.manager
            );

            this.handlerId = handlerId;
            this.handlerMonitor.receiveHandlerId(handlerId);
            this.handlerConnector.receiveHandlerId(handlerId);

            const globalMonitor = this.manager.getMonitor();
            const unsubscribe = globalMonitor.subscribeToStateChange(
                this.handleChange,
                { handlerIds: [handlerId] }
            );

            this.subscriptionTypeLifetime.add(unsubscribe);
            this.subscriptionTypeLifetime.add(unregister);
            // this.subscriptionTypeLifetime.add(() => console.debug("unsubscribed from " + type.toString()));
        }

        private handleChange = () => {
            this.collector$.next(this.handlerMonitor);
        };

        unsubscribe() {
            if (this.subscriptionTypeLifetime) {
                this.subscriptionTypeLifetime.unsubscribe();
            }
            this.subscriptionConnectionLifetime.unsubscribe();
        }

        add(teardown: TeardownLogic): Subscription {
            return this.subscriptionConnectionLifetime.add(teardown);
        }

        get closed() {
            return (
                this.subscriptionConnectionLifetime &&
                this.subscriptionConnectionLifetime.closed
            );
        }
    }
    return ConnectionInner;
}
