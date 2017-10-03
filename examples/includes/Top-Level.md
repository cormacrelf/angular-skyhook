When using `__PackageName__`, you follow this general pattern:

1. Create a connection and declare its behaviour ([this
   section](#1-creating-connections))
2. Use methods or directives to connect it to real DOM elements:
   [[2-Connecting-to-DOM]]
3. Use the connection's `collect` method to listen for relevant state changes:
   [[3-Monitoring-State]]
4. Remember to tear down the connection in `ngOnDestroy()`.

## 1. Creating Connections

First, inject [[DndService]] into your component.

```typescript
constructor(private dnd: DndService) { ... }
```

Then, use one of the methods [[DndService.dragSource]],
[[DndService.dropTarget]] to create one and store it as an instance variable.

```typescript
source = this.dnd.dragSource({
  type: "CAT",
  beginDrag: (monitor) => ({ this.cat.id })
  // ...
});
// or
target = this.dnd.dropTarget({
  types: ["CAT", "ZEBRA"],
  // ...
});
constructor(private dnd: DndService) { ... }
```

Then, you will want to add some behaviour beyond the default by looking into the
Spec type defined for your connection type.



## 3 different Connections

There are three kinds of connection. [[DragSource]] is for allowing
components to be dragged. [[DropTarget]] allows components to accept
dragged items. [[DragLayer]] is an advanced feature that allows you to
implement your own custom drag previews.

### 

### All `Connection` objects

#### `destroy()`

This method **MUST** be called, however you choose to, in `ngOnDestroy()`. If you
don't, you will leave subscriptions hanging around that will fire callbacks on
components that no longer exist.

#### The `takeUntil: Observable<any>` parameter

If your components have lots of subscriptions, a common pattern is to create an
RxJS Subject called `destroy$`, to use
`Observable.takeUntil(destroy$).subscribe(...)` and to call `destroy.next()` once
to clean up all of them. __PackageName__ supports this pattern with the
`takeUntil` parameter. Simply:

```typescript
destroy$ = new Subject<void>();
target = this.dnd.dropTarget({
  /* spec */
}, destroy$);
```

