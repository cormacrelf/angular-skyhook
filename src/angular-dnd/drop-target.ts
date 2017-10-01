import { NgZone } from '@angular/core';
import { DragDropMonitor } from 'dnd-core';
import { DropTargetMonitor } from './target-monitor';
import { invariant } from './invariant';

import { DndTypeOrTypeArray } from './type-ish';

export interface DropTargetSpec {
  // we would use DndTypeOrTypeArray but this is public API, gotta be usable on IDE hover
  /** Optional; use if you don't need it to change over time. */
  types?: DndTypeOrTypeArray;
  drop?: (monitor: DropTargetMonitor) => Object | void;
  hover?: (monitor: DropTargetMonitor) => void;
  canDrop?: (monitor: DropTargetMonitor) => boolean;
}

export function createTargetFactory(spec: DropTargetSpec, zone: NgZone) {
  // zone = { run: (f) => { return f() } } as any;

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

      // don't run isDragging in the zone. Should be a pure function of `this`.
      return spec.canDrop(this.monitor);
    }

    isTicking = false;

    hover() {
      if (!spec.hover) {
        return;
      }

      if (!this.isTicking) {
        this.isTicking = true;
        requestAnimationFrame(() => {
          this.isTicking = false;
          // we might have dropped the item in the meantime
          if (! this.monitor.isOver()) { return; };
          zone.run(() => {
            spec.hover(this.monitor);
          });
        })
      }

    }

    drop() {
      if (!spec.drop) {
        return undefined;
      }

      return zone.run(() => {
        const dropResult = spec.drop(this.monitor);
        return dropResult;
      });
    }
  }

  return function createTarget(monitor: DragDropMonitor) {
    return new Target(monitor);
  };
}
