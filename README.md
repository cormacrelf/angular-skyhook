
## Installation

``` {.sh}
npm install [[[package-name]]]
npm install react-dnd-html5-backend
```

Or, `yarn add`, if you wish. Then import the module and provide the backend:

``` {.typescript}
import { [[[module-name]]] } from '[[[package-name]]]';
import HTML5Backend from 'react-dnd-html5-backend';

@NgModule({
  imports: [
    // Don't forget the forRoot()
    [[[module-name]]].forRoot(),
  ],
  providers: [
    // this makes the HTML5 backend available
    [[[module-name]]].provideBackend(HTML5Backend),
  ]
})
export class AppModule {}
```

If you need it on a child module, like a lazy-loaded router module, only add `[[[module-name]]]`.
This will ensure the backend and global drag state (the `DragDropManager` in `dnd-core`) is only initialized once.

## Terminology and motivation

A **'drag source'** is so named because when you drag it, you don't pick up the
exact HTML DOM element that was rendered; in fact, that element generally
remains in place. Instead, you pick up an abstract item, which is represented by
a Plain Old Javascript Object (POJO) that has a `type: string|symbol` and
possibly some other information. A **'drop target'** is an endpoint for the drag.

There is just one global drag state. You can't be dragging more than one thing
at once. Both drag sources and drop targets are **connected** to the global drag
state, and each is also connected also to a DOM element. If you create either,
you get a **connection** back, 

(what item is being dragged, where is it, is it hovering on me?)

In many drag and drop libraries, because they involve actually lifting the DOM
element, the default behaviour is to 'move' that object around and put it
somewhere else. They provide a 'copy' option just in case you don't want that,
but the choices often end there.

In contrast, [[[package-name]]] and `react-dnd` that came before it do not
attach any specific meaning to a drag+drop operation by default. You get to
define what happens when a drop starts or ends or even hovers. Here are some
examples:

* The [traditional `react-dnd` demo](http://react-dnd.github.io/react-dnd/examples-chessboard-tutorial-app.html), a chess board with movable pieces and rules
* Deleting items by dragging them to a 'trash can', like in macOS' dock.
  - Showing the trash can only when there's a deletable item being dragged
  - Enlarging the trash can when you hover over it
* Stamping out a template by dragging the template into a work area
* Merging two items by dragging one on top of the other
* Hover over a 'folder' for a few seconds to 'drill down' into it
* The famous lists and cards on [trello.com](https://trello.com), which actually uses `react-dnd`
* A diagramming tool where you can draw links between nodes
* A graphical query builder, or visual data pipeline like [Luna](http://www.luna-lang.org/)
* [Many other demonstrations of `react-dnd` (most with GIFs) in use](https://github.com/react-dnd/react-dnd/issues/384)

Your own visual drag/drop metaphor could be anything from a stock-standard sortable list
to an intricate puzzle or a way of turning a tedious task into an easy one.

Some of these examples would involve 

## API Reference

### `DndConnectorService.dragSource(spec, options?)`

This method creates a `Connection` object that represents a drag source and its
behaviour, and can be connected to a DOM element by assigning it to the
`[dragSource]` directive on that element in your template.

Like `dropTarget(...)` below, it can be used just for subscribing to drag state
information related to a particular item type or list of types. You do not have
to connect it to a DOM element if that's all you want. See the `monitor()`
method.

The `spec` argument


This is the corollary of [`react-dnd`'s `DragSource` higher-order component](http://react-dnd.github.io/react-dnd/docs-drag-source.html).

#### `spec: DragSourceSpec`

##### `type?`

*Usually required; see below*. Either a string or an ES6 symbol. (Create
a symbol with `Symbol("some text")`.)

Only the drop targets registered for the same type will react to the items
produced by this drag source. Read the overview to learn more about the items
and types.

If you wish to have a dynamic type, you must call `Connection.setType()` in
either of your component's `ngOnInit` or `ngOnChanges` methods. You might use
this to emit a type based on an `@Input()` property:

```typescript
@Input() emitType: string;
@Input() model: { parentId: number; name: string; };

target = this.dnd.dragSource({
  /* ... don't bother with setting types here ... */
});

ngOnChanges() {
  // use what your parent component told you to
  this.target.setType(this.emitType);
  // or create groupings on the fly
  this.target.setType(this.model.parentId.toString());
}
```

### `DndConnectorService.dropTarget(spec, options?)`

This is the corollary of [`react-dnd`'s `DropTarget` higher-order component](http://react-dnd.github.io/react-dnd/docs-drop-target.html).

Creates a `Connection` object that represents a drop target and its behaviour,
and can be connected to a DOM element by assigning it to the `[dropTarget]`
directive on that element in your template.

Like `dragSource(...)` above, it can be used just for subscribing to drag state
information related to a particular item type or list of types. You do not have
to connect it to a DOM element if that's all you want. See the `monitor()`
method.

The `spec` argument

##### `types?`

*Usually required; see below.*

##### `drop?: (monitor: DropTargetMonitor) => Object | void`

Optional. Called when a compatible item is dropped on the target. You may either
return `undefined`, or a plain object. If you return an object, it is going to
become the drop result and will be available to the drag source in its `endDrag`
method as `monitor.getDropResult()`. This is useful in case you want to perform
different actions depending on which target received the drop. If you have
nested drop targets, you can test whether a nested target has already handled
drop by checking `monitor.didDrop()` and `monitor.getDropResult()`. Both this
method and the source's `endDrag()` method are good places to fire
`@ngrx/store` actions. This method will not be called if `canDrop()` is
defined and returns `false`.

```typescript
interface DropTargetSpec {
  drop?: (monitor: DropTargetMonitor) => Object | void;
  hover?: (monitor: DropTargetMonitor) => void;
  canDrop?: (monitor: DropTargetMonitor) => boolean;
}
```

## Common problems / FAQ

##### [1] In the spec callbacks, my component doesn't have any properties, and it can't call `this.method()`!

**Solution**: Make sure you use the arrow function syntax in your specs so `this` will refer to your component. Example:

```typescript
paperCount = 3;
limitedSupplyOfPaper = this.dnd.dragSource({
    type: "PAPER",
    // use shorthand for one-liners that return a value
    canDrag: () => this.paperCount > 0,
    // 
    endDrag: (monitor) => {
        if (monitor.didDrop()) {
            this.paperCount--;
        }
    }
});
```

[This demo](https://goo.gl/VYQMEs) shows comprehensively what `this` refers to in arrow functions vs regular ones.

##### [2] I've subscribed to `DragSourceMonitor.canDrag()` to visualize a source. My component greys out while dragging!

In fact, every instance of the component will grey out while dragging. Sample of the problem (**don't copy this!**)

```html
<div [dragSource]="source" [style.background]="(canDrag$|async) ? 'yellow' : 'grey'">content</div>
```

```typescript
someProperty = true;
dragSource = this.dnd.dragSource({
    canDrag: () => this.someProperty
});
canDrag$ = this.dragSource.collect().map(monitor => monitor.canDrag());
```

`DragSourceMonitor.canDrag()` doesn't just spit out exactly what you return from
`DragSourceSpec.canDrag()`. It actually asks the `dnd-core` internal state
monitor whether your particular drag source is currently draggable. When you
drag something, you can't start another drag until you drop that thing;
therefore, the internal state is correct in saying 'no, you can't pick up
another thing right now'. So, `DragSourceMonitor.canDrag()` will flip to `false`
when you drag, and back again when you drop.

Secondly, `DragSourceSpec` is a set of _callbacks_. They will be called when any
relevant _internal drag state_ changes, not when your component does. Refer to
the docs on [DragSourceSpec](#dragsourcespec).

**Solution**: keep your canDrag logic simple, and replicate it in your template.

```html
<div [style.background]="someProperty ? 'yellow' : 'grey'"> content </div>
```

#### [2] 



# AngularDndTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
