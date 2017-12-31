/**
 * @module 3-Monitoring-State
 */
/** a second comment */

import { MonitorBase } from './monitor-base';

export interface DropTargetMonitor extends MonitorBase {
    /**
     * Returns `true` if there is a drag operation in progress, and the owner's
     * `canDrop()` returns true or is not defined.
     */
    canDrop(): boolean;

    /**
     * Returns `true` if there is a drag operation in progress, and the pointer
     * is currently hovering over the owner. You may optionally pass
     * `{ shallow: true }` to strictly check whether only the owner is being
     * hovered, as opposed to a nested target.
     */
    isOver(options?: {shallow: boolean}): boolean;

    /**
     * Returns a plain object representing the last recorded drop result. The
     * drop targets may optionally specify it by returning an object from their
     * `drop()` methods. When a chain of `drop()` is dispatched for the nested
     * targets, bottom up, any parent that explicitly returns its own result
     * from `drop()` overrides the drop result previously set by the child.
     * Returns `null` if called outside `drop()`.
     * */
    getDropResult(): Object & any;

    didDrop(): boolean;
}
