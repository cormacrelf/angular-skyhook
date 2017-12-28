/**
 * @module 1-Top-Level
 */
/** a second comment */

import { DragSourceMonitor } from './source-monitor';

export interface DragSourceSpec {

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
  beginDrag(monitor: DragSourceMonitor): Object & any;

  /**
   * Optional. Queries your component to determine whether this source can be
   * dragged. Default returns true; this is often sufficient.
   */
  canDrag?(monitor: DragSourceMonitor): boolean;

  /** By default, only the drag source that initiated the drag operation is
   *  considered to be dragging. You might override this by matching on the
   *  monitor.getItem().id and your component's id, or similar. Do this if the
   *  original component may be unmounted during the dragging and later
   *  "resurrected" with a different parent. For example, when moving a card
   *  across the lists in a Kanban board, you want it to retain the dragged
   *  appearance—even though technically, the component gets unmounted and
   *  a different one gets mounted every time you hover over another list.
   *  *Note: You may not call `monitor.isDragging()` inside this method.*
   *
   * **NOTE: runs outside Angular change detection.** This is for performance
   * reasons. You shouldn't be making changes to your component here anyway. If
   * you do change your component inside this callback, it may not appear
   * immediately, and if you use `zone.run()` then you may experience
   * performance degradation..
   */
  isDragging?(monitor: DragSourceMonitor): boolean;

  /**
   * Optional. Queries your component to determine whether this source can be
   * dragged. Default returns true; this is often sufficient.
   *
   * This is a good place to fire actions or modify a component. You will often
   * want to check [[DragSourceMonitor.didDrop]]() and [[DragSourceMonitor.getDropResult]]() for more
   * details.
   */
  endDrag?(monitor: DragSourceMonitor): void;
}
