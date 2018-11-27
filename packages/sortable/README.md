### Go back to [`@angular-skyhook/core`](../)

# `@angular-skyhook/sortable`

[![npm](https://img.shields.io/npm/v/@angular-skyhook/sortable.svg)](https://www.npmjs.com/package/@angular-skyhook/sortable)

### Installation

Make sure you have `@angular-skyhook/core` and a backend installed, ideally `@angular-skyhook/multi-backend`. Read the core docs first, and make sure you have a firm grasp on it.

```sh
yarn add @angular-skyhook/sortable
```

Then add `SkyhookSortableModule` where required.

```typescript
import { SkyhookSortableModule } from '@angular-skyhook/sortable';

@NgModule({
  imports: [
    // ...
    // SkyhookDndModule.forRoot( ... ),
    SkyhookSortableModule,
  ]
})
export class AppModule {}
```

### A sortable with *truly ridiculous* levels of customizability

This is different from the hundreds of other sortable libraries, because it is extremely pared back, and makes almost no limiting choices. This is NOT opinionated software.

- It does **no list operations for you**. You drive the reordering and reverting yourself.
- It is **not coupled to DOM**, so you can render your list and any previews or transit elements however you like.
- It accepts a `SortableSpec` to define behaviour, much like a DragSourceSpec or DropTargetSpec but abstracted over a whole sortable and all elements in it.
- It gives you the complete power of `@angular-skyhook/core` to alter visuals as you see fit.

So yes, it's a bit harder to use than, say, [`ng2-dragula`][ng2d]. Does the extra implementation effort pay off? There are so many cool uses, this section needs headings.

[ng2d]: https://github.com/valor-software/ng2-dragula/

##### Visuals and interaction
- You can have non-sortable items inside your container. Like a header that you can still drop on when the sortable is otherwise empty.
- You control all your visuals with `DragSource.listen()`, so apply your own classes based on `isDragging` and friends.
- Your drag previews are completely customizable (using `[dragPreview]` or `<skyhook-preview>`) like any other Skyhook item. Useful for making multi-select. Or axis snapping. Or showing warning messages ('you can't drop that here') alongside your mouse. Go for your life.
- Your dragged items can morph as they skip between two different lists, because they are completely re-rendered.
  This is great for a 'form builder' where library items/icons expand into full-size in-place templates when you drag them in.
- Drag handles are easy, just put the `[dragSource]` on something else.

##### Integration and IO
- You can (in theory) use it with Material `mat-table`s, or any other list component.
- You can insert 'external' elements by creating a DragSource (see `[ssExternal]`).
- Each sortable item exists as a Skyhook item that can be dropped onto a normal drop target (like a trash can).
- You don't need to use plain JS arrays, you can use Angular's `FormArray` or `Immutable.js`, because the library doesn't care. (Although you can do native but immutable updates with `immer` instead).

##### Data backing
- You can easily implement the sorting in an `@ngrx/store` (some helpers make this even easier).
- You don't have to hijack or revert someone else's predefined sort operations to implement 'multi-select & drag'
- If you want to build keyboard navigation on top with identical operations, you don't have to mimic someone else's library operations, just refactor your own.

### Terminology

- **item**: an `@angular-skyhook/core` item, returned from `beginDrag`. In sortables, all these items are `DraggedItem` objects.
- **data**: one of the JS objects in the backing array. It is opaque to the library, but you need a unique identifier field on it.
- **preview**: follows your mouse pixel by pixel. E.g. an HTML5 drag preview or a `<skyhook-preview>` from the multi-backend.
- **transit**: you render this as part of the list while there is an item in-flight. Must follow the mouse, but not pixel for pixel.
- **context**: a small set of information enabling draggable elements to know where they are (index and data wise) without being coupled to the container's DOM children. Derived from a container and `*ngFor` data and index.

### Usage Overview

> Hint: The best way to get started is by reading the [example 
> code](../examples/).

Here's a rough guide:

1. `SortableSpec` is the data backing interface for your sortable. It defines
the Skyhoook type, what happens when you hover on a new spot, drop an item,
etc. Maybe you want to overwrite a list on a single component, maybe you are
firing `@ngrx/store` actions. You must implement it according to the
[requirements and lifecycle][sortablespec-lifecycle].

2. For simpler list displays, make a container with `<skyhook-sortable-list>`
and provide it an `<ng-template ssTemplate let-context>` for each element.

3. For more complicated rendering situations, use `ssSortable` directive
directly, and render an `*ngFor` inside it, pulling out `let i = index` as
well.

4. In both options, for each draggable element, you need an
`[ssRender]="context"` directive, which you need to get a reference to, and to
finally attach `[dragSource]="render.source"` somewhere.

[sortablespec-lifecycle]: ./additional-documentation/sortablespec-lifecycle.html
