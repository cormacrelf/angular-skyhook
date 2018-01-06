/**
 * @private
 */
/** a second comment */

import { NgZone } from '@angular/core';
import { InternalMonitor } from './internal-monitor';
import { DropTargetMonitor } from '../target-monitor';
import { invariant } from './invariant';
import { DropTargetSpec } from '../drop-target-spec';

export function createTargetFactory(spec: DropTargetSpec, zone: Zone): any {
  // zone = { run: (f) => { return f() } } as any;

  class Target {
    monitor: any;
    props: any;

    constructor(monitor: any) {
      this.monitor = monitor;
    }

    withChangeDetection<T>(fn: () => T): T {
      let x = fn();
      zone.scheduleMicroTask('DropTarget', () => {});
      return x;
    }

    receiveMonitor(monitor: any) {
      this.monitor = monitor;
    }

    canDrop() {
      if (!spec.canDrop) {
        return true;
      }

      // don't run isDragging in the zone. Should be a pure function of `this`.
      return spec.canDrop(this.monitor);
    }

    hover() {
      if (!spec.hover) {
        return;
      }
      this.withChangeDetection(() => {
        if (spec.hover) {
          spec.hover(this.monitor);
        }
      });
    }

    drop() {
      if (!spec.drop) {
        return undefined;
      }

      return this.withChangeDetection(() => {
        const dropResult = spec.drop && spec.drop(this.monitor);
        return dropResult;
      });
    }
  }

  return function createTarget(monitor: any): any {
    return new Target(monitor);
  };
}
