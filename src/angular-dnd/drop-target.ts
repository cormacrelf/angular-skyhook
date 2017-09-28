import { ElementRef } from '@angular/core';
import { DragDropMonitor } from 'dnd-core';
import { DropTargetMonitor } from './target-monitor';
import { invariant } from './invariant';

export interface DropTargetSpec {
    drop?: (monitor: DropTargetMonitor) => Object | void;
    hover?: (monitor: DropTargetMonitor) => void;
    canDrop?: (monitor: DropTargetMonitor) => boolean;
}

export function createTargetFactory(spec: DropTargetSpec) {

    class Target {
        monitor: DragDropMonitor;
        props: any;

        constructor(monitor: DragDropMonitor) {
            this.monitor = monitor;
        }

        receiveMonitor(monitor) {
            this.monitor = monitor;
        }

        canDrop() {
            if (!spec.canDrop) {
                return true;
            }

            return spec.canDrop(this.monitor);
        }

        hover() {
            if (!spec.hover) {
                return;
            }

            spec.hover(this.monitor);
        }

        drop() {
            if (!spec.drop) {
                return undefined;
            }

            const dropResult = spec.drop(this.monitor);
            return dropResult;
        }
    }

    return function createTarget(monitor: DragDropMonitor) {
        return new Target(monitor);
    };
}
