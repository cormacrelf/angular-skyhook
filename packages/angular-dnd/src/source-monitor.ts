/**
 * @module 3-Monitoring-State
 */
/** a second comment */

import { MonitorBase } from './internal/internal-monitor';

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
  getDropResult(): Object & any;

  /**
   * Returns `true` if some drop target handled the `drop` event; `false`
   * otherwise. Even if a target did not return a drop result, `didDrop()`
   * returns true. Use it inside `endDrag()` to test whether any drop target
   * has handled the drop. Returns `false` if called outside `endDrag()`.
   */
  didDrop(): boolean;
}
