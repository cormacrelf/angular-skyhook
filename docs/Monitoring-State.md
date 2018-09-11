# Monitoring State

## How to change your template depending on the drag state

1. Take any connection object, like `DropTarget`
2. Call `.listen()` with a function that returns what information you want to
   monitor
3. Save the resulting Observable to an instance variable in your component
4. Use the observable via the `| async` pipe to render alternate content in
   your template.

For example:

```html
<div [dropTarget]="target"
    class="cat-target"
    [class.cat-target--hovering]="hovering$ | async">
    drop cats here
</div>
```

```scss
.cat-target { background: #eee; }
.cat-target--hovering { background: lightgoldenrodyellow; }
```

```typescript
target = this.dnd.dropTarget("CAT", {
    drop: monitor => {
        console.log('dropped a cat');
    }
});

// this is a very useful combination on a drop target,
// which expresses 'hovering over' + ('same type' + 'DropTargetSpec.canDrop returned true')
// you almost always want to use the combination rather than isOver on its own
hovering$ = this.target.listen(m => m.isOver() && m.canDrop());
```

## What can you listen to?

Each type of connection gets a different set of information available on the
monitor. They are laid out in these interfaces:

- [DragSourceMonitor](../../interfaces/DragSourceMonitor.html)
- [DropTargetMonitor](../../interfaces/DropTargetMonitor.html)
- [DragLayerMonitor](../../interfaces/DragLayerMonitor.html)
- All three derive from [MonitorBase](../../interfaces/MonitorBase.html)

## Optimisation

Note that all three monitors have very rapidly-changing information available on
them, such as the current viewport-mouse offset. The `.listen()` functions will
optimise component updates for you. You **don't** want to:

1. Subscribe to more properties than you need. This hinders performance.
2. Subscribe to the entire monitor object. It will only fire once, and then
   never again, because the monitor object itself is the same each time.

The implementation of `listen()` includes an implementation of RxJS'
`distinctUntilChanged` that also optimises for JS Objects with the same keys
but different values. The following two examples fire exactly as often:

```typescript
isDraggingPlain$ = this.source.listen(m => m.isDragging());
isDraggingObj$   = this.source.listen(m => ({ isDragging: m.isDragging() }));
```

This is helpful if you have a lot of properties to listen to and wish to
reduce the number of `| async` pipes in your code, or if you want to copy
some `react-dnd` code.

## Making decisions in the Spec based on current drag state

The other place you get access to a monitor is in the callbacks in each Spec.
Monitors carry some information only relevant and usable inside these callbacks.
Those methods are documented in the monitor interfaces, and particularly useful
methods are highlighted in each of the Spec callbacks, such as
`DropTargetSpec.drop`.
