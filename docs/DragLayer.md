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

   * whether something is being dragged
   * what type it is
   * where the drag started
   * where the dragged element is now

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
data from somewhere else using only an `id`.
This practice is even more
important if you are using, or planning on using, anything other than the HTML5
backend, because no other backend provides automatic previews. In those cases
you must handle every draggable `type` in a drag layer to have any previews at
all.

