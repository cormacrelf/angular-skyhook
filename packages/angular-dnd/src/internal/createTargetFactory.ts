import { NgZone } from '@angular/core';
import { InternalMonitor } from './internal-monitor';
import { DropTargetMonitor } from '../target-monitor';
import { invariant } from './invariant';
import { DropTargetSpec } from "../drop-target";

export function createTargetFactory(spec: DropTargetSpec, zone: NgZone): any {
  // zone = { run: (f) => { return f() } } as any;

  class Target {
    monitor: any;
    props: any;

    constructor(monitor: any) {
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

          zone.run(() => {
            spec.hover && spec.hover(this.monitor);
          });

      // if (!this.isTicking) {
      //   this.isTicking = true;
      //   requestAnimationFrame(() => {
      //     this.isTicking = false;
      //     // we might have dropped the item in the meantime
      //     if (! this.monitor.isOver()) { return; };
      //     zone.run(() => {
      //       spec.hover(this.monitor);
      //     });
      //   })
      // }

    }

    drop() {
      if (!spec.drop) {
        return undefined;
      }

      return zone.run(() => {
        const dropResult = spec.drop && spec.drop(this.monitor);
        return dropResult;
      });
    }
  }

  return function createTarget(monitor: any): any {
    return new Target(monitor);
  };
}
