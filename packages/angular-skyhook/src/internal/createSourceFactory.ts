import { NgZone } from '@angular/core';
import { invariant } from './invariant';
import { DragSourceSpec } from '../drag-source-specification';
import { DragSourceMonitor } from '../source-monitor';

export class Source {
    constructor(
        private spec: DragSourceSpec<any>,
        private zone: Zone,
        private monitor: DragSourceMonitor,
    ) {
    }

    withChangeDetection<T>(fn: () => T): T {
        let x = fn()
        this.zone.scheduleMicroTask('DragSource', () => { });
        return x;
    }

    canDrag() {
        if (!this.spec.canDrag) {
            return true;
        }

        return this.withChangeDetection(() => {
            return this.spec.canDrag(this.monitor);
        });
    }

    isDragging(globalMonitor: any, sourceId: any) {
        if (!this.spec.isDragging) {
            return sourceId === globalMonitor.getSourceId();
        }

        return this.spec.isDragging(this.monitor);
    }

    beginDrag() {
        return this.withChangeDetection(() => {
            return this.spec.beginDrag(this.monitor);
        });
    }

    endDrag() {
        if (!this.spec.endDrag) {
            return;
        }

        return this.withChangeDetection(() => {
            if (this.spec.endDrag) {
                this.spec.endDrag(this.monitor);
            }
        });
    }
}

export function createSourceFactory(spec: DragSourceSpec<any>, zone: Zone) {
    return function createSource(monitor: DragSourceMonitor) {
        return new Source(spec, zone, monitor);
    }
}
