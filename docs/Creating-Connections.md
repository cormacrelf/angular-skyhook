# Creating connections

There are three types of connection.

- [DragSource](../../interfaces/DragSource.html)
  is for allowing components to be dragged. Create one with
  [SkyhookDndService#dragSource](../../injectables/SkyhookDndService.html#dragSource)
  using a
  [DragSourceSpec](../../interfaces/DragSourceSpec.html)
  and attach it to the DOM
  with `[dragSource]="..."`.

- [DropTarget](../../interfaces/DropTarget.html)
  is for allowing components to be dragged. Create one with
  [SkyhookDndService#dropTarget](../../injectables/SkyhookDndService.html#dropTarget)
  using a
  [DropTargetSpec](../../interfaces/DropTargetSpec.html)
  and attach it to the DOM
  with `[dropTarget]="..."`.

- [DragLayer](../../interfaces/DragLayer.html)
  is an advanced feature that allows you to implement your own
  custom drag previews. Create one with
  [SkyhookDndService#dragLayer](../../injectables/SkyhookDndService.html#dragLayer),
  but you don't attach them to the DOM, you simply listen for changes.

All three of them have the same lifecycle, and all three of them offer a
`.listen()` function, which allows you to listen to changes. See
[ConnectionBase](../../interfaces/ConnectionBase.html) for what they have in
common.

## Using the `SkyhookDndService` to create connections

First, inject 
[SkyhookDndService](../../injectables/SkyhookDndService.html),
 into your component.

```typescript
constructor(private dnd: SkyhookDndService) { ... }
```

Then, use one of the methods
[SkyhookDndService#dragSource](../../injectables/SkyhookDndService.html#dragSource),
[SkyhookDndService#dropTarget](../../injectables/SkyhookDndService.html#dropTarget)
to create one and store it as an instance variable, and make sure to tear down
the connection in `ngOnDestroy`.

```typescript
source = this.dnd.dragSource("CAT", {
  beginDrag: (monitor) => ({ id: this.cat.id })
  // ...
});
// or
target = this.dnd.dropTarget(["CAT", "ZEBRA"], {
  // ...
});
constructor(private dnd: SkyhookDndService) { ... }

ngOnDestroy() {
  this.source.unsubscribe();
  // or
  this.target.unsubscribe();
}
```

Then, you will want to add some behaviour beyond the default by looking into the
Spec input for your connection type.

## Destroying Connections

All three types of connection need to be destroyed when your component is
destroyed. If you don't, you will have strange problems.

__The easy way is to call
[`.unsubscribe()`](../../interfaces/ConnectionBase.html#unsubscribe)__ on the
connection object in `ngOnDestroy`.

```typescript
ngOnDestroy() {
    this.source.unsubscribe();
    this.target.unsubscribe();
    this.layer.unsubscribe();
    // neat. we're done.
}

```

### But I have ten other subscriptions!

In situations where your component has **a lot** of subscription logic to
maintain, there are more powerful ways of unsubscribing to many things at once.

You can create an RxJS `Subscription` object in your component, and call
`Subscription.add(conn)` with your connection. There is a convenience parameter
on each of the `SkyhookDndService` methods which will do this for you.

```typescript
import { Subscription } from 'rxjs';

// ...

subs = new Subscription();

source = this.dnd.dragSource({
  // ...
}, this.subs);

target = this.dnd.dragSource({
  // ...
}, this.subs);

// ...

ngOnInit() {
    // subscribe to lots of things here
    this.subs.add(myService.subscribe(...));
    this.subs.add(myService.subscribe(...));
    this.subs.add(myService.subscribe(...));
    this.subs.add(myService.subscribe(...));
}
ngOnDestroy() {
  // This will unsubscribe everything, including source and target
  this.subs.unsubscribe();
}
```

(It is not recommended to have a large number of drag sources and drop targets
attached to a single component, especially not in a variably-sized array,
simply because that is poor component structure. Instead, consider creating a
component that handles a single piece of dragging logic, and use an `*ngFor` over
the whole component.)

[Next: Connecting to DOM](./2.-connecting-to-dom.html).
