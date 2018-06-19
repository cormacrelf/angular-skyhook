/**
 * @module 1-Top-Level
 */
/** a second comment */

import { DragSourceMonitor } from './source-monitor';

/*
Note that you can't infer Item if you supply both beginDrag and endDrag,
since endDrag needs to find some type to put in the 'monitor' argument.
But people can always nail it down with `dnd.dragSource<MyItemType>('BOX', { ...spec })`.
Related: https://github.com/Microsoft/TypeScript/issues/19345
*/

export interface DragSourceSpec<
  Item,
  DropResult = {}
  > {

  /**
   * Required. When the dragging starts, `beginDrag` is called. You **must** return
   * a plain JavaScript object describing the data being dragged. What you
   * return is the *only* information available to the drop targets about the
   * drag source so it's important to pick the minimal data they need to know.
   * You may be tempted to put a reference to the component into it, but you
   * should try very hard to avoid doing this because it couples the drag
   * sources and drop targets. It's a good idea to return something like `{ id:
   * this.id }` from this method.
   *
   */
  // erase Item here because inference doesn't know what it is yet
  beginDrag(monitor: DragSourceMonitor<void, void>): Item;

  /**
   * Optional. Queries your component to determine whether this source can be
   * dragged. Default returns true; this is often sufficient.
   */
  canDrag?(monitor: DragSourceMonitor<void, void>): boolean;

  /** By default, only the drag source that initiated the drag operation is
   *  considered to be dragging. You might override this by matching on the
   *  {@link DragSourceMonitor#getItem}.id and your component's id, or similar. Do this if the
   *  original component may be unmounted during the dragging and later
   *  "resurrected" with a different parent. For example, when moving a card
   *  across the lists in a Kanban board, you want it to retain the dragged
   *  appearance—even though technically, the component gets unmounted and
   *  a different one gets mounted every time you hover over another list.
   *  *Note: You may not call {@link DragSourceMonitor#isDragging} inside this method.*
   *
   * **NOTE: runs outside Angular change detection.** This is for performance
   * reasons. You shouldn't be making changes to your component here anyway. If
   * you do change your component inside this callback, it may not appear
   * immediately, and if you use `NgZone.run()` then you may experience
   * performance degradation..
   */
  isDragging?(monitor: DragSourceMonitor<Item, void>): boolean;

  /**
   * Optional. Notifies your component when dragging ends.
   *
   * This is a good place to fire actions or modify a component. You will often
   * want to check {@link DragSourceMonitor#didDrop} and {@link DragSourceMonitor#getDropResult} for more
   * details.
   */
  endDrag?(monitor: DragSourceMonitor<Item, DropResult>): void;
}
