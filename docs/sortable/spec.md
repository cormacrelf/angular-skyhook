There are a number of requirements a `SortableSpec` implementation must satisfy.

- after `beginDrag`, the element you picked up must still be under the mouse;
- after `hover`, the element you picked up must be under the mouse;
    - it should now be at the index `item.hover.index` in the list identified by `item.hover.listId`
- you are free to implement `drop` and `endDrag` as you wish, but they should probably involve 'save the temporary order' and 'set temporary = saved' respectively.

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

