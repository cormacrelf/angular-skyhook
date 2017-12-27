/**
 * @private
 */
/** a second comment */

import { DndTypeOrTypeArray, Offset } from '../type-ish';
import { Observable } from 'rxjs/Observable';

export interface MonitorBase {

  /** The type of the item in transit. Returns `null` if no item is being dragged. */
  getItemType(): string | symbol | null;

  /** The item in transit, if any. This is what you returned from
   *  DragSourceSpec.beginDrag(). Returns `null` if no item is being dragged. */
  getItem(): Object & any | null;

  /** The initial mouse x,y position relative to the viewport, when the current
   *  drag operation started. Returns `null` if no item is being dragged. */
  getInitialClientOffset(): Offset | null;
  /** x,y relative to viewport of the item's DOM element before it was dragged.
   *   Returns `null` if no item is being dragged. */
  getInitialSourceClientOffset(): Offset | null;
  /** The current mouse x,y position relative to the viewport. Returns `null`
   *   if no item is being dragged. */
  getClientOffset(): Offset | null;
  /** A vector x,y of the displacement of the dragged item from its initial
   *   position. Returns `null` if no item is being dragged. */
  getDifferenceFromInitialOffset(): Offset | null;
  /** The projected x,y position of the root DOM element of the drag source
   *   = its initial position + displacement. Returns `null` if no item is
   *   being dragged. */
  getSourceClientOffset(): Offset | null;

}

// DragLayerMonitor is actually just an InternalMonitor but with only some methods available
// So we make InternalMonitor extend it instead of the other way round

export interface DragLayerMonitor extends MonitorBase {
  /** `true` if there is a drag operation in progress, `false` otherwise. */
  isDragging(): boolean;
}

export interface InternalMonitor extends DragLayerMonitor {
  subscribeToOffsetChange(f: Function): Function;
  subscribeToStateChange(f: Function): Function;

  canDragSource(sourceId: any): boolean;
  isDraggingSource(sourceId: any): boolean;

  canDropOnTarget(targetId: any): boolean;
  isOverTarget(targetId: any, options: any): boolean;
  getDropResult(): boolean;
  didDrop(): boolean;
}

