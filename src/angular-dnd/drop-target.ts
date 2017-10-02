import { NgZone } from '@angular/core';
import { DragDropMonitor } from 'dnd-core';
import { DropTargetMonitor } from './target-monitor';
import { invariant } from './invariant';

import { DndTypeOrTypeArray } from './type-ish';

export interface DropTargetSpec {

  /** Usually required; specify if you don't need it to change over time. */
  types?: DndTypeOrTypeArray;

  /**
   * Query your component to determine whether an item can be dropped on this target.
   *
   * NOTE: runs outside Angular change detection. You shouldn't be making
   * changes to your component here anyway.
   *
   * Default, when not specified, is `true`.
   **/
  canDrop?: (monitor: DropTargetMonitor) => boolean;

  /**
   * Called very frequently while the mouse hovers over the drop target while
   * dragging a relevant item.
   *
   * Important and different from react-dnd: calls will be debounced via
   * requestAnimationFrame.
   * */
  hover?: (monitor: DropTargetMonitor) => void;

  /** Called when a relevant item is dropped on this particular drop target. */
  drop?: (monitor: DropTargetMonitor) => Object | void;
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
