import { NgZone } from '@angular/core';
import { DragDropMonitor } from 'dnd-core';
import { invariant } from './invariant';

import { DragSourceMonitor } from './source-monitor';

export interface DragSourceSpec {

  /** Usually required; use if you don't need it to change over time. */
  type?: string | symbol;

  /**
   * Required. Called when dragging begins. The return value is the abstract
   * 'item' in transit, accessible thereafter by monitor.getItem(). It's a good
   * idea to return something like `{ id: props.id }` from this method.
   */
  beginDrag:   (monitor: DragSourceMonitor) => {} & any;

  /**
   * Optional. Query your component to determine whether this source can be
   * dragged. Default returns true; this is often sufficient.
   */
  canDrag?:    (monitor: DragSourceMonitor) => boolean;

  /**
   * By default, only the drag source that initiated the drag operation is
   * considered to be dragging. You might override this by matching on the
   * monitor.getItem().id and your component's id, or similar. This might help
   * with resurrecting child components in another parent.
   *
   * NOTE: runs outside Angular change detection. You shouldn't be making
   * changes to your component here anyway.
   */
  isDragging?: (monitor: DragSourceMonitor) => boolean;

  /**
   * Optional. Query your component to determine whether this source can be
   * dragged. Default returns true; this is often sufficient.
   *
   * This is a good place to fire actions or modify a component. You will often
   * want to check monitor.didDrop() and monitor.getDropResult() for more
   * details.
   */
  endDrag?:    (monitor: DragSourceMonitor) => void;
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

      // don't run isDragging in the zone. Should be a pure function of `this`.
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
        spec.endDrag(this.monitor);
      });
    }
  }

  return function createSource(monitor: DragDropMonitor) {
    return new Source(monitor);
  };
}
