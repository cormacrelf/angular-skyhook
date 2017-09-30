import { DragDropManager } from './manager';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgZone } from '@angular/core';

export interface DragLayerConnection {
  collect<T>(fn: (monitor: any) => T): Observable<T>;

  /**
   * Dies when obs fires.
   *
   * Use with the `destroy$: Subject()` / `ngOnDestroy() { this.destroy$.next() }` pattern.
   * */
  destroyOn(obs: Observable<any>): void;

  destroy(): void;
}

export class DragLayerConnectionClass implements DragLayerConnection {
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

  private handleChange = () => {
    const monitor = this.manager.getMonitor() as DragLayerMonitor;
    this.zone.run(() => {
      window.requestAnimationFrame(() => {
        this.collector$.next(monitor);
      })
    });
  }

  // TODO: apply shallowEqual(a,b)
  collect<T>(fn: (monitor: DragLayerMonitor) => T): Observable<T> {
    return this.collector$.map(fn);
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
    this.unsubscribeFromOffsetChange();
    this.unsubscribeFromStateChange();
  }
}

export interface Offset { x: number; y: number; };

export interface DragLayerMonitor {
  isDragging(): boolean;
  getItemType(): string | symbol | null;
  getItem(): object | null;
  getInitialClientOffset(): Offset | null;
  getInitialSourceClientOffset(): Offset | null;
  getClientOffset(): Offset | null;
  getDifferenceFromInitialOffset(): Offset | null;
  getSourceClientOffset(): Offset | null;
}

interface InternalMonitor extends DragLayerMonitor {
  subscribeToOffsetChange(Function): Function;
  subscribeToStateChange(Function): Function;
}


