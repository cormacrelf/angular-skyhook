
After the break, we will discuss implementation strategies.

<!-- <div class="mermaid"> -->
<!-- sequenceDiagram -->
<!--     participant Spec as SortableSpec -->
<!--     participant A as index 0 -->
<!--     participant B as index 1 -->
<!--     Note over A,B: Initial order = A, B -->
<!--     A&#45;&#45;>>Spec: beginDrag -->
<!--     Note over A: A's transit stays put,<br/>but isDragging&#45;>true -->
<!--     B&#45;&#45;>>Spec: hover causes reorder -->
<!--     Note over B: A's transit now here -->
<!--     alt endings -->
<!--         B&#45;&#45;>>Spec: drop makes temporary order permanent -->
<!--         Note over A,B: New order = B, A -->
<!--         A&#45;&#45;>>Spec: endDrag = noop -->
<!--     else -->
<!--         Note right of B: mouse drops<br/>somewhere else -->
<!--         A&#45;&#45;>>Spec: endDrag causes reset -->
<!--         Note over A,B: elements return to original positions -->
<!--     end -->
<!-- </div> -->
<!-- <script src="../media/mermaid.min.js"></script> -->
<!-- <script>mermaid.initialize({startOnLoad:true});</script> -->
