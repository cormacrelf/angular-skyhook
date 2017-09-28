import { DragDropMonitor } from 'dnd-core';
import { invariant } from './invariant';

import { DragSourceMonitor } from './source-monitor';

export interface DragSourceSpec {
  beginDrag:   (monitor: DragSourceMonitor) => any;
  endDrag?:    (monitor: DragSourceMonitor) => void;
  canDrag?:    (monitor: DragSourceMonitor) => boolean;
  isDragging?: (monitor: DragSourceMonitor) => boolean;
}

export function createSourceFactory(spec: DragSourceSpec) {

    class Source {
        monitor: DragDropMonitor;

        constructor(monitor: DragDropMonitor) {
            this.monitor = monitor;
        }

        canDrag() {
            if (!spec.canDrag) {
                return true;
            }

            return spec.canDrag(this.monitor);
        }

        isDragging(globalMonitor, sourceId) {
            if (!spec.isDragging) {
                return sourceId === globalMonitor.getSourceId();
            }

            return spec.isDragging(this.monitor);
        }

        beginDrag() {
            const item = spec.beginDrag(this.monitor);
            return item;
        }

        endDrag() {
            if (!spec.endDrag) {
                return;
            }

            spec.endDrag(this.monitor);
        }
    }

    return function createSource(monitor: DragDropMonitor) {
        return new Source(monitor);
    };
}
