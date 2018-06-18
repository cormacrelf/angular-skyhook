/**
 * @module 1-Top-Level
 */
/** a second comment */

import { DropTargetMonitor } from './target-monitor';
import { DragSourceMonitor } from './source-monitor';
import { TypeOrTypeArray } from './type-ish';
import { Observable, TeardownLogic } from 'rxjs';
import { DragLayerMonitor } from './layer-monitor';
import { DropTargetConnector, DragSourceConnector, DragSourceOptions, DragPreviewOptions } from './connectors';
import { Subscription, SubscriptionLike } from 'rxjs';

/**
 * A base type to represent a DOM connection.
 */
export interface ConnectionBase<TMonitor> extends SubscriptionLike {

  /**
   * A connection maintains a subscription to `dnd-core`'s drag state
   * changes. This function is how you are notified of those changes.
   *
   * This function is essentially RxJS `Observable.map` with one small
   * optimization: it runs the output of
   * the function you provide through `distinctUntilChanged`, and checks
   * reference equality (`===`) for scalars and `shallowEqual` for Objects.
   *
   * Because of #2, you can happily emulate `react-dnd`-style code like:

   * ```typescript
   * collected$ = this.target.listen(monitor => ({
   *   isDragging: monitor.isDragging(),
   *   isOver: monitor.isOver(),
   *   canDrop: monitor.canDrop(),
   * }));
   * ```

   * ... in which case you probably want to use the `*ngIf as` pattern for
   *  grouping subscriptions into one bound template variable:

   * ```html
   * <ng-container *ngIf="collected$ | async as c">
   *   <p>{{c.isDragging ? 'dragging': null}}<p>
   *   ...
   * </ng-container>
   * ```

   * You can also subscribe one-by-one, with `isDragging$ = listen(m => m.isDragging())`.
   */
  listen<O>(mapTo: (monitor: TMonitor) => O): Observable<O>;

  /**
   * This method **MUST** be called, however you choose to, when `ngOnDestroy()` fires.
   * If you don't, you will leave subscriptions hanging around that will fire
   * callbacks on components that no longer exist.
   */
  unsubscribe(): void;

  /**
   * Same as RxJS Subscription.add().
   * Useful, for example, for writing wrappers for the {@link SkyhookDndService} methods,
   * which might internally listen()/subscribe to {@link DropTargetSpec#hover} and provide
   * a convenient callback after you hover without dropping or exiting for a specified
   * duration. That would require the following pattern:
   *
   * ```typescript
   * function wrapper(dndService, types, spec, callback) {
   *     let subj = new Subject();
   *     let dt = dndService.dropTarget(types, {
   *         ...spec,
   *         hover: monitor => {
   *             subj.next();
   *             spec.hover && spec.hover(monitor);
   *         }
   *     });
   *     // runs the callback until the returned connection
   *     // is destroyed via unsubscribe()
   *     dt.add(subj.pipe( ... ).subscribe(callback))
   *     return dt;
   * }
   * ```
   */
  add(teardown: TeardownLogic): Subscription;

}

/**
 * Represents one drop target and its behaviour, that can listen to the state
 * and connect to a DOM element.
 *
 * To create one, refer to {@link SkyhookDndService#dropTarget}.
 */
export interface DropTarget extends ConnectionBase<DropTargetMonitor> {

  /** Use this method to have a dynamically typed target. If no type has
   *  previously been set, it creates the subscription and allows the
   *  `[dragSource]` DOM element to be connected. If you do not need to
   *  dynamically update the type, you can set it once via the
   *  {@link DropTargetSpec#types} property.
   *
   *  See {@link DragSource#setType} for an example of how to set
   *  a dynamic type, for it is very similar here.
  */
  setTypes(type: TypeOrTypeArray): void;

  /** This function allows you to connect a DOM node to your `DropTarget`.
   *  You will not usually need to call this directly;
   *  it is more easily handled by the directives.
   *
   *  The subscription returned is automatically unsubscribed when the connection is made.
   *  This may be immediate if the `DropTarget` already has a type.
   */
  connectDropTarget(elementOrNode: Node): Subscription;
}

/**
 * DragSource.md
 */
export interface DragSource extends ConnectionBase<DragSourceMonitor> {

  /** Use this method to have a dynamically typed source. If no type has
   *  previously been set, it creates the subscription and allows the
   *  `[dragSource]` DOM element to be connected. If you do not need to
   *  dynamically update the type, you can set it once via the
   *  {@link DragSourceSpec.type} property.
   *
   *  If you wish to have a dynamic type based on an `@Input()` property, for
   *  example, you must call `setType()` in either of your component's
   *  `ngOnInit` or `ngOnChanges` methods:

   *     @Input() type: string;
   *     @Input() model: { parentId: number; name: string; };
   *     target = this.dnd.dragSource(null, {
   *       // ...
   *     });
   *     ngOnChanges() {
   *       // use what your parent component told you to
   *       this.target.setType(this.type);
   *       // or create groupings on the fly
   *       this.target.setType("PARENT_" + this.model.parentId.toString());
   *     }

   * It may be more convenient or easier to understand if you write:

   *     @Input() set type(t) {
   *       this.source.setType(t);
   *     }
   *     source = this.dnd.dragSource(null, {
   *       beginDrag: () => ({ ... })
   *     });

   */
  setType(type: string|symbol): void;

  /** This function allows you to connect a DOM node to your `DragSource`.
   *  You will not usually need to call this directly;
   *  it is more easily handled by the directives.
   *
   *  The subscription returned is automatically unsubscribed when the connection is made.
   *  This may be immediate if the `DragSource` already has a type.
   */
  connectDragSource(elementOrNode: Node, options?: DragSourceOptions): Subscription;

  /** This function allows you to connect a DOM node to your `DragSource` as a **preview**.
   *  You will not usually need to call this directly;
   *  it is more easily handled by the directives.
   *
   *  You might use an `ElementRef.nativeElement`, or even an
   *  [`Image`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image).
   *
   *      const img = new Image();
   *      img.onload = this.source.connectDragPreview(img);
   *      img.src = '...';
   *
   *  The subscription returned is automatically unsubscribed when the connection is made.
   *  This may be immediate if the `DragSource` already has a type.
   */
  connectDragPreview(elementOrNode: Node, options?: DragPreviewOptions): Subscription;
}

/**
 * {@link include:DragLayer.md}
 */
export interface DragLayer extends ConnectionBase<DragLayerMonitor> {

  /** For listen functions in general, see {@link DragSource.listen}.
   *
   *  This listen function is called any time the global drag state
   *  changes, including the coordinate changes, so that your component can
   *  provide a timely updated custom drag preview. You can ask the monitor for
   *  the client coordinates of the dragged item. Read the {@link DragLayerMonitor}
   *  docs to see all the different possibile coordinates you might subscribe
   *  to.
   */
  listen<O>(mapTo: (monitor: DragLayerMonitor) => O): Observable<O>;

}

