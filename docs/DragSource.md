Like [[DropTarget]], it can be used just for subscribing to
drag state information related to a particular item type or list of types.
You do not have to connect it to a DOM element if that's all you want.

The `spec` argument ([[DragSourceSpec]]) is a set of _queries_ and
_callbacks_ that are called at appropriate times by the internals. The
queries are for asking your component whether to drag/listen and what item
data to hoist up; the callback (just 1) is for notifying you when the drag
ends.


To create one, refer to [[DndService.dragSource]].
