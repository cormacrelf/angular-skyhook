import { DropTargetMonitor } from './target-monitor';

/** The spec passed to {@link SkyhookDndService#dropTarget}.
 *
 * Note the two type parameters. Both must represent plain JS objects. See the extended
 * discussion of these type parameters at {@link DragSourceSpec}.
 */
export interface DropTargetSpec<
  Item extends {} = {},
  DropResult extends {} = {}
  > {

  /**
   * Queries your component to determine whether an item can be dropped on this target.
   *
   * **NOTE: runs outside Angular change detection.** This is for performance
   * reasons. You shouldn't be making changes to your component here anyway. If
   * you do change your component inside this callback, it may not appear
   * immediately, and if you use `NgZone.run()` then you may experience
   * performance degradation.
   *
   * Default, when not specified, is `true`.
   **/
  canDrop?(monitor: DropTargetMonitor<Item, DropResult>): boolean;

  /** Called frequently while the mouse hovers over the owner drop target while
   * dragging a relevant item.
   *
   * */
  hover?(monitor: DropTargetMonitor<Item, DropResult>): void;

  /** Called when a compatible item is dropped on the target. You may either
   *  return nothing, or a plain object.
   *
   * If you return an object, it is going to become the drop result and will be
   * available to the drag source in its {@link DragSourceSpec#endDrag} method as
   * {@link DropTargetMonitor#getDropResult}. This is useful in case you want the
   * source to perform different actions depending on which target received the
   * drop. Otherwise, it is simpler to handle the dropped item here.
   *
   * If you have nested drop targets, you can test whether a nested target has
   * already handled drop by checking {@link DropTargetMonitor#didDrop}. Both this
   * method and the source's `endDrag()` method are good places to fire
   * `@ngrx/store` actions.
   *
   * This method will not be called if `canDrop()` is defined and returns `false`.
   */

  drop?(monitor: DropTargetMonitor<Item, DropResult>): DropResult | void;

}
