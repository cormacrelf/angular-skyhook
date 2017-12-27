/**
 * @private
 */
/** a second comment */

import { NgZone } from '@angular/core';
import { invariant } from './invariant';
import { DragSourceSpec } from "../drag-source-spec";
import { DragSourceMonitor } from "../source-monitor";

export function createSourceFactory(spec: DragSourceSpec, zone: NgZone): any {

  class Source {
    monitor: DragSourceMonitor;

    constructor(monitor: DragSourceMonitor) {
      this.monitor = monitor;
    }

    canDrag() {
      if (!spec.canDrag) {
        return true;
      }

      return zone.run(() => {
        return spec.canDrag && spec.canDrag(this.monitor);
      });
    }

    isDragging(globalMonitor: any, sourceId: any) {
      if (!spec.isDragging) {
        return sourceId === globalMonitor.getSourceId();
      }

      // return zone.run(() => {
      // });
      return spec.isDragging(this.monitor);
    }

    beginDrag() {
      return zone.run(() => {
        return spec.beginDrag(this.monitor);
      });
    }

    endDrag() {
      if (!spec.endDrag) {
        return;
      }

      return zone.run(() => {
        spec.endDrag && spec.endDrag(this.monitor);
      });
    }
  }

  return function createSource(monitor: DragSourceMonitor) {
    return new Source(monitor);
  };
}
