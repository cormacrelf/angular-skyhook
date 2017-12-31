When using `angular-skyhook`, you follow this general pattern:

1. Create a connection and specify its behaviour ([this
   section](#1-creating-connections))
2. Use methods or directives to connect it to real DOM elements:
   [[2-Connecting-to-DOM]]
3. Use the connection's `listen` method to listen for relevant state changes:
   [[3-Monitoring-State]]
4. Remember to destroy the connection in `ngOnDestroy()`.

## 1. Creating Connections

First, inject [[SkyhookDndService]] into your component.

```typescript
constructor(private dnd: SkyhookDndService) { ... }
```

Then, use one of the methods [[SkyhookDndService.dragSource]],
[[SkyhookDndService.dropTarget]] to create one and store it as an instance variable,
and make sure to tear down the connection in `ngOnDestroy`.

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

### Types of Connection

There are three types of connection.

- [[DragSource]] is for allowing components to be dragged. Create one with
  [[SkyhookDndService.dragSource]] using a [[DragSourceSpec]], and attach it to the DOM
  with `[dragSource]="..."`.

- [[DropTarget]] allows components to accept dragged items. Create one with
  [[SkyhookDndService.dropTarget]] using a [[DropTargetSpec]], and attach it to the DOM
  with `[dropTarget]="..."`.

- [[DragLayer]] is an advanced feature that allows you to implement your own
  custom drag previews. Create one with [[SkyhookDndService.dragLayer]], but you don't
  attach them to the DOM, you simply listen for changes.

All three of them have the same lifecycle, and all three of them offer
a `.listen()` function, which allows you to listen to changes.

### Destroying Connections

Connections need to be destroyed when your component is destroyed. If you don't,
you will have strange problems.

You have two options. The latter is for situations when your component has a lot
of subscription logic to maintain. **Either:**

*  __Call `.unsubscribe()`__ on the connection object in `ngOnDestroy`, as
   illustrated above.
*  __Or__, create an RxJS Subscription object in your component, and
   call `Subscription.add(conn)` with your connection. There is a convenience
   parameter on each of the `SkyhookDndService` methods which will do this for you.

Example of the second way:

```typescript
import { Subscription } from 'rxjs/Subscription';
// ...
subs = new Subscription();
source = this.dnd.dragSource({
  // ...
}, this.subs);
// ...
ngOnDestroy() {
  // This will unsubscribe the drag source as well
  this.subs.unsubscribe();
}
```

