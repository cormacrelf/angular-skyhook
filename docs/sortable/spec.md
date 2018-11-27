# SortableSpec Lifecycle

## Requirements of SortableSpec

There are a number of requirements a `SortableSpec` implementation must satisfy.

1. after `beginDrag`, the element you picked up (= *transit*) must still be 
   under the mouse;
2. after `hover`, the element you picked up (= *transit*) must be:
    1. under the mouse; and
    2. at the index `item.hover.index` in the list identified by 
       `item.hover.listId`

The previews can be anywhere; it is the transit elements that must move, 
because they carry the `ssRender` directives that can produce further 
reordering, and if those directives are out of order, your sortable won't make 
sense.

The specific meaning of 'at the index' in 2b is that the `index` property of 
the `context` passed to `ssRender` is the same as the `hover.index` on the 
`item` passed to `hover(item)`. In general, this means you will be re-rendering 
your list to match, and the `NgForOf` gives you new indexes.

You are free to implement `drop` and `endDrag` as you wish, but they should 
probably involve 'save the temporary order' and 'set temporary = saved' 
respectively.

## Lifecycle

The following diagram summarises the calls made to `SortableSpec` during a drag.

<div class="mermaid">
sequenceDiagram
    participant Spec as SortableSpec
    participant C as Component
    participant S as ssSortable
    participant R as origin ssRender
    participant R2 as other ssRender
    Note over R: user drags
    R->>Spec: ask canDrag() ?
    R->>Spec: beginDrag(item)
    Spec-->>C: no changes
    loop While Dragging
        Note over R2: hover over other<br/>ssRender
        R2->>Spec: ask canDrop() ?
        R2->>Spec: hover(item)
        Note right of Spec: children reordered<br/> to match item.hover
        Spec-->>C: cause reordering
        R-->R2: reorder
    end
    opt if dropped on ssSortable
        S->>Spec: ask canDrop() ?
        S->>Spec: drop(item)
        Spec-->>C: cause reordering
    end
    R->>Spec: endDrag(item)
    Spec-->>C: cause reordering
</div>
<script src="../media/mermaid.min.js"></script>
<script>mermaid.initialize({startOnLoad:true});</script>

### 'No changes' after beginDrag

You should not reorder anything within beginDrag. This would probably violate 
Requirement #1; moreover, it doesn't make any sense.

The particular item that got picked up will be able to react, because 
`ssRender.isDragging$` will emit `true`.

### The implementation of 'Cause reordering' is up to you

You can implement this at the most basic level by setting variables on a 
component that isn't `OnPush`; you could also use RxJS, `@ngrx` and other more 
powerful solutions.
