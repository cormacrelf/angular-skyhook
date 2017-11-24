import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgZone } from '@angular/core';
import { DragLayer } from '../connection-types';
import { DragLayerMonitor, InternalMonitor } from '../internal/internal-monitor';
import { areCollectsEqual } from '../utils/areCollectsEqual';

export class DragLayerConnectionClass implements DragLayer {
  unsubscribeFromOffsetChange: Function;
  unsubscribeFromStateChange: Function;
  private readonly collector$: BehaviorSubject<DragLayerMonitor>;

  constructor (private manager: any, private zone: NgZone) {
    const monitor = this.manager.getMonitor() as InternalMonitor;
    this.collector$ = new BehaviorSubject<DragLayerMonitor>(monitor);
    this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(
      this.handleChange,
    );
    this.unsubscribeFromStateChange = monitor.subscribeToStateChange(
      this.handleChange,
    );

    this.handleChange();
  }

  isTicking = false;

  private handleChange = () => {
    // console.log(this.inc);
    // if (!this.isTicking) {
    //   this.isTicking = true;
    //   window.requestAnimationFrame(() => {
    //     this.isTicking = false;
        this.zone.run(() => {
          const monitor = this.manager.getMonitor() as DragLayerMonitor;
          this.collector$.next(monitor);
        });
    //   })
    // }
  }

  collect<P>(mapFn: (monitor: DragLayerMonitor) => P): Observable<P> {
    return this.collector$.map(mapFn).distinctUntilChanged(areCollectsEqual);
  }

  destroy() {
    this.unsubscribeFromOffsetChange();
    this.unsubscribeFromStateChange();
  }
}

