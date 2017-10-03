This method creates a [[DragSource]] object that represents a drag source
and its behaviour, and can be connected to a DOM element by assigning it to
the `[dragSource]` directive on that element in your template. It is the
corollary of [`react-dnd`'s
`DragSource`](http://react-dnd.github.io/react-dnd/docs-drag-source.html).

Like [[DndService.dropTarget]], it can be used just for subscribing to
drag state information related to a particular item type or list of types.
You do not have to connect it to a DOM element if that's all you want.

The `spec` argument ([[DragSourceSpec]]) is a set of _queries_ and
_callbacks_ that are called at appropriate times by the internals. The
queries are for asking your component whether to drag/listen and what item
data to hoist up; the callback (just 1) is for notifying you when the drag
ends.


To create one, refer to [[DndService.dragSource]].
