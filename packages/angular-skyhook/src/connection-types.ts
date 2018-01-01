/**
 * @module 1-Top-Level
 */
/** a second comment */

import { DropTargetMonitor } from './target-monitor';
import { DragSourceMonitor } from './source-monitor';
import { DndTypeOrTypeArray } from './type-ish';
import { Observable } from 'rxjs/Observable';
import { DragLayerMonitor } from './layer-monitor';
import { DropTargetConnector, DragSourceConnector } from './connectors';
import { Subscription, ISubscription } from 'rxjs/Subscription';

/** @private */
export interface ConnectionBase<TMonitor> extends ISubscription {

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

}

/** @private */
export interface Connection<TMonitor, TConnector> extends ConnectionBase<TMonitor> {

  /** This function allows you to connect a DOM node to your `DragSource`. It
   *  is formulated as a callback so that connecting may be deferred until the
   *  connection has a type. You will not usually need to call this directly;
   *  it is more easily handled by the directives.
   *
   *  To connect a DOM node, you must use one of the methods provided by the
   *  `connector` object in the callback.
   */
  connect(fn: (connector: TConnector) => void): Subscription;

}

/**
 * Represents one drop target and its behaviour, that can listen to the state
 * and connect to a DOM element.
 *
 * To create one, refer to [[SkyhookDndService.dropTarget]].
 */
export interface DropTarget extends Connection<DropTargetMonitor, DropTargetConnector> {

  /** Use this method to have a dynamically typed target. If no type has
   *  previously been set, it creates the subscription and allows the
   *  `[dragSource]` DOM element to be connected. If you do not need to
   *  dynamically update the type, you can set it once via the
   *  [[DropTargetSpec.types]] property.
   *
   *  See [[DragSource.setType]] for an example of how to set
   *  a dynamic type, for it is very similar here.
  */
  setTypes(type: DndTypeOrTypeArray): void;

}

/**
 * [[include: DragSource.md]]
 */
export interface DragSource extends Connection<DragSourceMonitor,
  DragSourceConnector> {

  /** Use this method to have a dynamically typed source. If no type has
   *  previously been set, it creates the subscription and allows the
   *  `[dragSource]` DOM element to be connected. If you do not need to
   *  dynamically update the type, you can set it once via the
   *  [[DragSourceSpec.type]] property.
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
}

/**
 * [[include:DragLayer.md]]
 */
export interface DragLayer extends ConnectionBase<DragLayerMonitor> {

  /** For listen functions in general, see [[DragSource.listen]].
   *
   *  This listen function is called any time the global drag state
   *  changes, including the coordinate changes, so that your component can
   *  provide a timely updated custom drag preview. You can ask the monitor for
   *  the client coordinates of the dragged item. Read the [[DragLayerMonitor]]
   *  docs to see all the different possibile coordinates you might subscribe
   *  to.
   */
  listen<O>(mapTo: (monitor: DragLayerMonitor) => O): Observable<O>;

}

