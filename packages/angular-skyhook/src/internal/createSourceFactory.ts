/**
 * @private
 */
/** a second comment */

import { NgZone } from '@angular/core';
import { invariant } from './invariant';
import { DragSourceSpec } from '../drag-source-spec';
import { DragSourceMonitor } from '../source-monitor';

export function createSourceFactory(spec: DragSourceSpec, zone: Zone): any {

  class Source {
    monitor: DragSourceMonitor;

    constructor(monitor: DragSourceMonitor) {
      this.monitor = monitor;
    }

    withChangeDetection<T>(fn: () => T): T {
      let x = fn();
      zone.scheduleMicroTask('DragSource', () => {});
      return x;
    }

    canDrag() {
      if (!spec.canDrag) {
        return true;
      }

      return this.withChangeDetection(() => {
        return spec.canDrag && spec.canDrag(this.monitor);
      });
    }

    isDragging(globalMonitor: any, sourceId: any) {
      if (!spec.isDragging) {
        return sourceId === globalMonitor.getSourceId();
      }

      return spec.isDragging(this.monitor);
    }

    beginDrag() {
      return this.withChangeDetection(() => {
        return spec.beginDrag(this.monitor);
      });
    }

    endDrag() {
      if (!spec.endDrag) {
        return;
      }

      return this.withChangeDetection(() => {
        if (spec.endDrag) {
          spec.endDrag(this.monitor);
        }
      });
    }
  }

  return function createSource(monitor: DragSourceMonitor) {
    return new Source(monitor);
  };
}
