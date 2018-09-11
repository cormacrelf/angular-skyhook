/**
 * Provide customisations for how a backend should handle a DragSource and
 * display items dragged from it. See {@link DragSource#connectDragSource}.
 */
export interface DragSourceOptions {

  /** A string. By default, 'move'. In the browsers that support this
   *  feature, specifying 'copy' shows a special "copying" cursor, while 'move'
   *  corresponds to the "move" cursor. You might want to use this option to
   *  provide a hint to the user about whether an action is destructive.
   */
  dropEffect?: 'copy' | 'move' | 'link' | 'none';

}

/**
 * Provide options for how to render a drag preview. See {@link DragSource#connectDragPreview}.
 */
export interface DragPreviewOptions {

  /** By default, false. If true, the component will learn that it is being
   *  dragged immediately as the drag starts instead of the next tick. This
   *  means that the screenshotting would occur with `monitor.isDragging()`
   *  already being true, and if you apply any styling like a decreased opacity
   *  to the dragged element, this styling will also be reflected on the
   *  screenshot. This is rarely desirable, so false is a sensible default.
   *  However, you might want to set it to true in rare cases, such as if you
   *  want to make the custom drag layers work in IE and you need to hide the
   *  original element without resorting to an empty drag preview which IE
   *  doesn't support.
   */
  captureDraggingState?: boolean;

  /** A number between 0 and 1. By default, 0.5. Specifies how the
   *  offset relative to the drag source node is translated into the the
   *  horizontal offset of the drag preview when their sizes don't match.
   *  0 means "dock the preview to the left", 0.5 means "interpolate linearly"
   *  and 1 means "dock the preview to the right".
   */
  anchorX?: number;

  /** A number between 0 and 1. By default, 0.5. Specifies how the
   *  offset relative to the drag source node is translated into the the
   *  vertical offset of the drag preview when their sizes don't match. 0 means
   *  "dock the preview to the top, 0.5 means "interpolate linearly" and
   *  1 means "dock the preview to the bottom."
   */
  anchorY?: number;


  /** By default, null. Specifies the vertical offset between the cursor and
   *  the drag preview element. If `offsetX` has a value, `anchorX` won't be
   *  used.
   */
  offsetX?: number;

  /** By default, null. Specifies the vertical offset between the cursor and
   *  the drag preview element. If `offsetY` has a value, `anchorY` won't be
   *  used.
   */
  offsetY?: number;

}

/** @ignore Connects a drop target to a DOM element */
export interface DropTargetConnector {
  dropTarget  ( elementOrNode: any): void;
}

/** @ignore Connects a drag source to a DOM element, either as the source itself or as
 *  a drag preview */
export interface DragSourceConnector {


  /** This connects a DOM `element` or node as a drag source. You may use an
   *  `ElementRef.nativeElement`, or even an
   *  [`Image`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image).
   */
  dragSource  ( elementOrNode: any, options?: DragSourceOptions): void;

  dragPreview ( elementOrNode: any, options?: DragPreviewOptions): void;

}
