# Connecting sources and targets to real DOM elements

Once you have created a connection, it is most useful when connected to a real
DOM element.

### Making a DOM element draggable

This means that events fired inside the element's bounding rectangle will start
a drag. Use `DragSourceDirective` to do this. It's as simple as:

```html
<div [dragSource]="source">
  drag me
</div>
```
```typescript
source = this.dnd.dragSource("DRAGME", {
  beginDrag: () => ({ name: 'Jones McFly' }),
  // other DragSourceSpec methods
});
// constructor, unsubscribe, etc
```

Then, investigate using
[DragSourceSpec](../../interfaces/DragSourceSpec.html)
to customise the behaviour.

### Making a DOM element into a drop target

This means your element will react to items being hovered or dropped within its
bounding rectangle.

```html
<div [dropTarget]="target">
  drop on me
</div>
```
```typescript
target = this.dnd.dropTarget("DRAGME", {
    drop: monitor => {
        console.log('dropped an item:', monitor.getItem()); // => { name: 'Jones McFly' }
    }
})
// constructor, unsubscribe, etc
```

Then, investigate using
[DropTargetSpec](../../interfaces/DropTargetSpec.html)
to customise the behaviour.


## Drag previews

__This is a feature unique to the HTML5 backend.__ If you are using another
backend, you will need a Drag Layer (see below) to render anything that follows
the mouse.

By default, a static screenshot of the original `[dragSource]` element will form
a drag preview and follow the mouse around.

### Using a different element as the preview source

If you want another element to be the source of the preview, you can use the
`[dragPreview]="source"` directive.

If you place a `DragPreviewDirective` on a different element than the
`[dragSource]`, and pass the same `DragSource` connection to it, the
preview element will take over the job of posing for the preview screenshot.

### Using a 'drag handle'

This is a common use of custom drag previews, where a box with a smaller handle
within it is only draggable from the handle. This is useful for moving
interactive blocks of UI (e.g. `<input/>` elements) around the screen, without
touching the inputs / selecting text / making unwanted changes.

1. Attach `[dragSource]="source"` to the handle.
2. Attach `[dragPreview]="source"` to the overall box being dragged.
3. As always, you may consider applying CSS `cursor: move` or `cursor: grab` or
   similar to the handle, to make sure users can discover what the handle is
   for.

### Using an image preview

1. Create an image element with `const img = new Image(); img.src = "...";`
2. Use `img.onload = () => { ... }` to wait for it to load. Inside the onload
   callback, run `someDragSourceConnection.connectDragPreview(img)`.

See `DragSource.connectDragPreview` and `DragPreviewOptions` for options.


[Next: Monitoring State](./3.-monitoring-state.html).
