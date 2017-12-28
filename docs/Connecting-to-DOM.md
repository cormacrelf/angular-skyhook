## Connecting Sources and Targets to the DOM

Once you have created a connection, it is most useful when connected to a real
DOM element.

### Making a DOM element draggable

This means that events fired inside the element's bounding rectangle will start
a drag. Use [[DragSourceDirective]] to do this. It's as simple as:

```html
<div [dragSource]="source">
  drag me
</div>
```
```typescript
source = this.dnd.dragSource("DRAGME", {
  beginDrag: () => ({}),
  // ...
})
// ...
```

### Making a DOM element into a drop target

This means your element will react to items being hovered or dropped within its
bounding rectangle.

```html
<div [dragSource]="source">
  drag me
</div>
```
```typescript
source = this.dnd.dragSource("DRAGME", {
  beginDrag: () => ({}),
  // ...
})
// ...
```

## Drag previews

__This is a feature unique to the HTML5 backend.__ If you are using another
backend, you will need a Drag Layer (see below) to render anything that follows
the mouse.

By default, a static screenshot of the original `[dragSource]` element will form
a drag preview and follow the mouse around.

### Using a different element as the preview source

If you want another element to be the source of the preview, you can use the
`[dragPreview]="source"` directive.

If you place a [[DragPreviewDirective]] on a different element than the
`[dragSource]`, and pass the same [[DragSource]] connection to it, the
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
   callback, run `someDragSourceConnection.connect(c => c.dragPreview(img))`.

See [[DragSource.connect]], and [[DragSourceConnector.dragPreview]] for options.


##  Drag Layers

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

1. Create a drag layer: [[DndService.dragLayer]]. Make sure to unsubscribe from
   it in `ngOnDestroy()`.
2. Listen to global drag state changes with [[DragLayer.listen]]. These are all available on [[DragLayerMonitor]]:

   * whether something is being dragged
   * what type it is
   * where the drag started
   * where the dragged element is now

3. If dragging, render a custom preview under the current mouse position,
   depending on the item type, in a `position: fixed` 'layer'. You may like to
   use an `*ngSwitch` on the type, rather than one drag layer per type, simply
   to reduce code duplication.

There are two complete examples of a drag layer in use. One piece of advice for
using drag layers effectively is to separate 'smart' and 'dumb' components. If
you have one component purely for visuals, which does all input through
`@Input()` and all interactivity through `@Output()` events, then you can reuse
it to display a drag preview based on either data in the item from
[[DragSourceSpec.beginDrag]], or supplied by a 'smart' component which pulls
data from somewhere else using only an `id`. This practice is even more
important if you are using, or planning on using, anything other than the HTML5
backend, because no other backend provides automatic previews. In those cases
you must handle every draggable `type` in a drag layer to have any previews at
all.
