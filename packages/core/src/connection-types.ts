/**
 * @module 1-Top-Level
 */
/** a second comment */

import { DropTargetMonitor } from './target-monitor';
import { DragSourceMonitor } from './source-monitor';
import { TypeOrTypeArray } from './type-ish';
import { Observable, TeardownLogic } from 'rxjs';
import { DragLayerMonitor } from './layer-monitor';
import {
    DragSourceOptions,
    DragPreviewOptions
} from './connectors';
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

```typescript
collected$ = this.target.listen(monitor => ({
  isDragging: monitor.isDragging(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}));
```

   * ... in which case you probably want to use the `*ngIf as` pattern for
   *  grouping subscriptions into one bound template variable:

```html
<ng-container *ngIf="collected$ | async as c">
  <p>{{c.isDragging ? 'dragging': null}}<p>
  ...
</ng-container>
```

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
```typescript
function wrapper(dndService, types, spec, callback) {
    let subj = new Subject();
    let dt = dndService.dropTarget(types, {
        ...spec,
        hover: monitor => {
            subj.next();
            spec.hover && spec.hover(monitor);
        }
    });
    // runs the callback until the returned connection
    // is destroyed via unsubscribe()
    dt.add(subj.pipe( ... ).subscribe(callback))
    return dt;
}
```
     */
    add(teardown: TeardownLogic): Subscription;
}

/**
 * Represents one drop target and its behaviour, that can listen to the state
 * and connect to a DOM element.
 *
 * To create one, refer to {@link SkyhookDndService#dropTarget}.
 */
export interface DropTarget<Item = {}, DropResult = {}>
    extends ConnectionBase<DropTargetMonitor<Item, DropResult>> {
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

    /**
     * Returns the drop target ID that can be used to simulate the drag and drop events with the testing backend. */
    getHandlerId(): any;
}

/**
Like {@link DropTarget}, it can be used just for subscribing to
drag state information related to a particular item type or list of types.
You do not have to connect it to a DOM element if that's all you want.

To create one, refer to {@link SkyhookDndService#dragSource}.
 */
export interface DragSource<Item, DropResult = {}>
    extends ConnectionBase<DragSourceMonitor<Item, DropResult>> {
    /** Use this method to have a dynamically typed source. If no type has
   *  previously been set, it creates the subscription and allows the
   *  `[dragSource]` DOM element to be connected. If you do not need to
   *  dynamically update the type, you can set it once via the
   *  {@link DragSourceSpec#type} property.
   *
   *  If you wish to have a dynamic type based on an `@Input()` property, for
   *  example, you must call `setType()` in either of your component's
   *  `ngOnInit` or `ngOnChanges` methods:

```typescript
@Input() type: string;
@Input() model: { parentId: number; name: string; };
target = this.dnd.dragSource(null, {
  // ...
});
ngOnChanges() {
  // use what your parent component told you to
  this.target.setType(this.type);
  // or create groupings on the fly
  this.target.setType("PARENT_" + this.model.parentId.toString());
}
```

   * It may be more convenient or easier to understand if you write:

```typescript
@Input() set type(t) {
  this.source.setType(t);
}
source = this.dnd.dragSource(null, {
  beginDrag: () => ({ ... })
});
```

   */
    setType(type: string | symbol): void;

    /** This function allows you to connect a DOM node to your `DragSource`.
     *  You will not usually need to call this directly;
     *  it is more easily handled by the directives.
     *
     *  The subscription returned is automatically unsubscribed when the connection is made.
     *  This may be immediate if the `DragSource` already has a type.
     */
    connectDragSource(
        elementOrNode: Node,
        options?: DragSourceOptions
    ): Subscription;

    /** This function allows you to connect a DOM node to your `DragSource` as a **preview**.
     *  You will not usually need to call this directly;
     *  it is more easily handled by the directives.
     *
     *  You might use an `ElementRef.nativeElement`, or even an
     *  [`Image`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image).
     *
```ts
const img = new Image();
img.onload = this.source.connectDragPreview(img);
img.src = '...';
```
     *
     *  The subscription returned is automatically unsubscribed when the connection is made.
     *  This may be immediate if the `DragSource` already has a type.
     */
    connectDragPreview(
        elementOrNode: Node,
        options?: DragPreviewOptions
    ): Subscription;

    /**
     * Returns the drag source ID that can be used to simulate the drag and drop events with the testing backend. */
    getHandlerId(): any;
}

/**
For many use cases, the default rendering of the HTML5 backend should suffice.
However, its drag preview has certain limitations. For example, it has to be an
existing node screenshot or an image, and it cannot change midflight.

Sometimes you might want to perform the custom rendering. This also becomes
necessary if you're using a custom backend. `DragLayer` lets you perform the
rendering of the drag preview yourself.

A drag layer is a special subscriber to the global drag state. It is called
a 'layer', not just a subscriber, because it is typically used to render custom
elements that follow the mouse, above all other elements. The data flows like
so:

```
drag start => global state => drag source => no preview
                              => drag layer  => preview rendered on the spot
drag moved => global state => drag layer  => preview moves
drag ends  => global state => drag layer  => preview erased
```

To use a drag layer as designed:

1. Create a drag layer: `SkyhookDndService.dragLayer`. Make sure to unsubscribe from
   it in `ngOnDestroy()`.

2. Listen to global drag state changes with `DragLayer.listen`. These are all available on `DragLayerMonitor`:
   whether something is being dragged, what type it is, where the drag started, where the dragged element is now.

3. If dragging, render a custom preview under the current mouse position,
   depending on the item type, in a `position: fixed` 'layer'. You may like to
   use an `*ngSwitch` on the type, rather than one drag layer per type, simply
   to reduce code duplication.


You can see an example of a drag layer over on the `Examples` page.

One piece of advice for using drag layers effectively is to separate 'smart' and
'dumb' components. If you have one component purely for visuals, which does all
input through `@Input()` and all interactivity through `@Output()` events, then
you can reuse it to display a drag preview based on either data in the item from
`DragSourceSpec.beginDrag`, or supplied by a 'smart' component which pulls
data from somewhere else using only an `id`. This practice is even more
important if you are using, or planning on using, anything other than the HTML5
backend, because no other backend provides automatic previews. In those cases
you must handle every draggable `type` in a drag layer to have any previews at
all.

Or, you could just use [@angular-skyhook/multi-backend](../@angular-skyhook/multi-backend/).

 */
export interface DragLayer<Item = any>
    extends ConnectionBase<DragLayerMonitor<Item>> {
    /** For listen functions in general, see {@link ConnectionBase#listen}.
     *
     *  This listen function is called any time the global drag state
     *  changes, including the coordinate changes, so that your component can
     *  provide a timely updated custom drag preview. You can ask the monitor for
     *  the client coordinates of the dragged item. Read the {@link DragLayerMonitor}
     *  docs to see all the different possibile coordinates you might subscribe
     *  to.
     */
    listen<O>(mapTo: (monitor: DragLayerMonitor<Item>) => O): Observable<O>;
}
