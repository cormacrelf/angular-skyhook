import { DragDropManager } from './manager';
import { invariant } from './invariant';
import { InternalMonitor, MonitorBase } from './internal-monitor';
type Monitor = any;

let isCallingCanDrag = false;
let isCallingIsDragging = false;

export interface DragSourceMonitor extends MonitorBase {

  /**
   * Returns `true` if no drag operation is in progress, and the owner's
   * `canDrag()` returns `true` or is not defined.
   */
  canDrag(): boolean;

  /**
   * Returns `true` if a drag operation is in progress, and either the owner
   * initiated the drag, or its `isDragging()` is defined and returns true.
   */
  isDragging(): boolean;


  /**
   * Returns a plain object representing the last recorded drop result. The
   * drop targets may optionally specify it by returning an object from their
   * `drop()` methods. When a chain of `drop()` is dispatched for the nested
   * targets, bottom up, any parent that explicitly returns its own result from
   * `drop()` overrides the child drop result previously set by the child.
   * Returns `null` if called outside `endDrag()`.
   */
  getDropResult(): {} & any;

  /**
   * Returns `true` if some drop target handled the `drop` event; `false`
   * otherwise. Even if a target did not return a drop result, `didDrop()`
   * returns true. Use it inside `endDrag()` to test whether any drop target
   * has handled the drop. Returns `false` if called outside `endDrag()`.
   */
  didDrop(): boolean;
}

class DragSourceMonitorClass implements DragSourceMonitor {
    internalMonitor: InternalMonitor;
    sourceId: any;

    constructor(manager: DragDropManager) {
        this.internalMonitor = manager.getMonitor();
    }

    receiveHandlerId(sourceId) {
        this.sourceId = sourceId;
    }

    canDrag() {
        invariant(
            !isCallingCanDrag,
            'You may not call monitor.canDrag() inside your canDrag() implementation. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html',
        );

        try {
            isCallingCanDrag = true;
            return this.internalMonitor.canDragSource(this.sourceId);
        } finally {
            isCallingCanDrag = false;
        }
    }

    isDragging() {
        invariant(
            !isCallingIsDragging,
            'You may not call monitor.isDragging() inside your isDragging() implementation. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html',
        );

        try {
            isCallingIsDragging = true;
            return this.internalMonitor.isDraggingSource(this.sourceId);
        } finally {
            isCallingIsDragging = false;
        }
    }

    getItemType() {
        return this.internalMonitor.getItemType();
    }

    getItem(): {} & any {
        return this.internalMonitor.getItem();
    }

    getDropResult() {
        return this.internalMonitor.getDropResult();
    }

    didDrop() {
        return this.internalMonitor.didDrop();
    }

    getInitialClientOffset() {
        return this.internalMonitor.getInitialClientOffset();
    }

    getInitialSourceClientOffset() {
        return this.internalMonitor.getInitialSourceClientOffset();
    }

    getSourceClientOffset() {
        return this.internalMonitor.getSourceClientOffset();
    }

    getClientOffset() {
        return this.internalMonitor.getClientOffset();
    }

    getDifferenceFromInitialOffset() {
        return this.internalMonitor.getDifferenceFromInitialOffset();
    }
}

export function createSourceMonitor(manager: DragDropManager): DragSourceMonitor {
    return new DragSourceMonitorClass(manager);
}
