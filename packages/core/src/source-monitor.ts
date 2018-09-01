import { MonitorBase } from './monitor-base';

/** The monitor available in {@link DragSource}'s listen method. */
export interface DragSourceMonitor<
  Item = {},
  DropResult = {}
  > extends MonitorBase<Item> {

  /**
   * Returns `true` if **NO drag operation is in progress**, and the owner's
   * `canDrag()` returns `true` or is not defined.
   *
   * Note that `canDrag` doesn't blindly return what you supplied in
   * {@link DragSourceSpec#canDrag}, so it isn't very useful as a general
   * source-is-enabled/disabled flag.
   *
   * Instead, keep your `canDrag` logic simple, and replicate it in your template.
   *
```html
<div [style.background]="someProperty ? 'yellow' : 'grey'"> content </div>
```

```typescript
{
  canDrag: () => this.someProperty
}
```
   */
  canDrag(): boolean;

  /**
   * Returns `true` if a drag operation is in progress, and either the owner
   * initiated the drag, or its `isDragging()` is defined and returns true.
   */
  isDragging(): boolean;


  /**
   * Returns a plain object representing the last recorded drop result. The
   * drop targets may optionally specify it by returning an object from their
   * `drop()` methods. When a chain of `drop()` is dispatched for the nested
   * targets, bottom up, any parent that explicitly returns its own result from
   * `drop()` overrides the child drop result previously set by the child.
   * Returns `null` if called outside `endDrag()`.
   */
  getDropResult(): DropResult;

  /**
   * Returns `true` if some drop target handled the `drop` event; `false`
   * otherwise. Even if a target did not return a drop result, `didDrop()`
   * returns true. Use it inside `endDrag()` to test whether any drop target
   * has handled the drop. Returns `false` if called outside `endDrag()`.
   */
  didDrop(): boolean;
}
