/**
 * @private
 */
/** a second comment */

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgZone } from '@angular/core';
import { DragLayer } from '../connection-types';
import { DragLayerMonitor } from '../layer-monitor';
import { InternalMonitor } from './internal-monitor';
import { areCollectsEqual } from '../utils/areCollectsEqual';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, TeardownLogic } from 'rxjs/Subscription';
import { scheduleMicroTaskAfter } from './scheduleMicroTaskAfter';

export class DragLayerConnectionClass implements DragLayer {

  unsubscribeFromOffsetChange: Function;
  unsubscribeFromStateChange: Function;
  private readonly collector$: BehaviorSubject<DragLayerMonitor>;
  private subscription = new Subscription();


  constructor (private manager: any, private zone: Zone) {
    const monitor = this.manager.getMonitor() as InternalMonitor;
    this.collector$ = new BehaviorSubject<DragLayerMonitor>(monitor);
    this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(
      this.handleOffsetChange,
    );
    this.unsubscribeFromStateChange = monitor.subscribeToStateChange(
      this.handleStateChange,
    );

    this.subscription.add(() => {
      this.unsubscribeFromOffsetChange();
      this.unsubscribeFromStateChange();
    });

    this.handleStateChange();
  }

  isTicking = false;

  private handleStateChange = () => {
    const monitor = this.manager.getMonitor() as DragLayerMonitor;
    this.collector$.next(monitor);
  }
  private handleOffsetChange = () => {
    const monitor = this.manager.getMonitor() as DragLayerMonitor;
    this.collector$.next(monitor);
  }

  listen<P>(mapFn: (monitor: DragLayerMonitor) => P): Observable<P> {
    return this.collector$.pipe(
      map(mapFn),
      distinctUntilChanged(areCollectsEqual),
      scheduleMicroTaskAfter(this.zone)
    );
  }

  unsubscribe() {
    this.collector$.complete();
    this.subscription.unsubscribe();
  }

  add(teardown: TeardownLogic): Subscription {
    return this.subscription.add(teardown);
  }

  get closed() {
    return this.subscription.closed;
  }

}

