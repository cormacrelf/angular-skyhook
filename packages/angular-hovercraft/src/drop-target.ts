/**
 * @module 1-Top-Level
 */
/** a second comment */

import { NgZone } from '@angular/core';
import { DropTargetMonitor } from './target-monitor';
import { invariant } from './internal/invariant';

import { DndTypeOrTypeArray } from './type-ish';

export interface DropTargetSpec {

  /**
   * Usually required; specify if you don't need it to change over time.
   *
   * This drop target will only react to the items produced by the drag sources
   * of the specified type or types.
   *
   * If you want your target to accept a dynamic set of types, don't specify it
   * here; instead use [[DropTarget.setTypes]].
   * */
  types?: DndTypeOrTypeArray;

  /**
   * Queries your component to determine whether an item can be dropped on this target.
   *
   * **NOTE: runs outside Angular change detection.** This is for performance
   * reasons. You shouldn't be making changes to your component here anyway. If
   * you do change your component inside this callback, it may not appear
   * immediately, and if you use `zone.run()` then you may experience
   * performance degradation.
   *
   * Default, when not specified, is `true`.
   **/
  canDrop?(monitor: DropTargetMonitor): boolean;

  /** Called frequently while the mouse hovers over the owner drop target while
   * dragging a relevant item.
   *
   * */
  hover?(monitor: DropTargetMonitor): void;

  /**
   * Called when a compatible item is dropped on the target. You may either
   * return nothing, or a plain object.
   *
   * If you return an object, it is going to become the drop result and will be
   * available to the drag source in its [[DragSourceSpec.endDrag]] method as
   * `monitor.getDropResult()`. This is useful in case you want to perform
   * different actions depending on which target received the drop.
   *
   * If you have nested drop targets, you can test whether a nested target has
   * already handled drop by checking `monitor.didDrop()` and
   * `monitor.getDropResult()`. Both this method and the source's `endDrag()`
   * method are good places to fire `@ngrx/store` actions. This method will not
   * be called if `canDrop()` is defined and returns `false`.
   */
  drop?(monitor: DropTargetMonitor): Object | void;

}
