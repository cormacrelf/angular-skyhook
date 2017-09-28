import { NgZone } from '@angular/core';
import { DragDropMonitor } from 'dnd-core';
import { invariant } from './invariant';

import { DragSourceMonitor } from './source-monitor';

export interface DragSourceSpec {
  beginDrag:   (monitor: DragSourceMonitor) => any;
  endDrag?:    (monitor: DragSourceMonitor) => void;
  canDrag?:    (monitor: DragSourceMonitor) => boolean;
  isDragging?: (monitor: DragSourceMonitor) => boolean;
}

export function createSourceFactory(spec: DragSourceSpec, zone: NgZone) {

    class Source {
        monitor: DragDropMonitor;

        constructor(monitor: DragDropMonitor) {
            this.monitor = monitor;
        }

        canDrag() {
            if (!spec.canDrag) {
                return true;
            }

            return zone.run(() => {
              return spec.canDrag(this.monitor);
            });
        }

        isDragging(globalMonitor, sourceId) {
            if (!spec.isDragging) {
                return sourceId === globalMonitor.getSourceId();
            }

            return zone.run(() => {
              return spec.isDragging(this.monitor);
            });
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
              spec.endDrag(this.monitor);
            });
        }
    }

    return function createSource(monitor: DragDropMonitor) {
        return new Source(monitor);
    };
}
