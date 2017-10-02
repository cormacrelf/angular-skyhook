
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

Your own visual drag/drop metaphor could be anything from a stock-standard
sortable list to an intricate puzzle or a way of turning a tedious task into an
easy one. It is important to note that for really bare-bones sortable lists,
where you have a mutable array of simple values, you don't necessarily need the
superpowers in this library.

## Translation from `react-dnd`

There are many code examples and libraries on the web written for `react-dnd`,
the most important of which is the actual [`react-dnd`
documentation](http://react-dnd.github.io/react-dnd/docs-overview.html). In the
interest of making them useful or at least understandable, this library presents
a fairly similar API to the original. There are, of course, some differences
mandated by the style and limitations of React and Angular. We will illustrate
this with the `react-dnd` `DragSource` compared to `[[[package-name]]]`
`DndService.dragSource()`. Here are the [original API
docs](http://react-dnd.github.io/react-dnd/docs-drag-source.html) on
`DragSource`; the following is a small but complete example for a quick
reference. If you know how to use `react-dnd` already, then this should show you
most of it.

```javascript.jsx
/////
/////  React version
/////

let itemSource = {
  beginDrag: (props, monitor) => {
    return { someProperty: props.someProperty };
  },
  endDrag: (props, monitor, component) => {
    if (monitor.didDrop()) {
      component.fireAction(monitor.getItem());
    }
  }
}
@DragSource("ITEM", itemSource, (connect, monitor) => ({
  connectDragSource: connect.connectDragSource(),
  isDragging: monitor.isDragging(),
}))
export class MyComponent {
  fireAction() { /* ... */ }
  render() {
    const { someProperty, isDragging } = this.props;
    return connectDragSource(
      <div>{someProperty} {isDragging ? 'I am being dragged now' : null}</div>
    );
  }
}
```

```typescript
/////
/////  Angular version
/////

@Component({
  template: `<div [dragSource]="itemSource">
    {{someProperty}} <span *ngIf="(collected$|async).isDragging">I am being dragged now</span>
  </div>`
})
export class MyComponent {
  @Input() someProperty: string;
  itemSource = dnd.dragSource({
    type: "ITEM",
    beginDrag: (monitor) => {
      return { someProperty: this.someProperty };
    },
    endDrag: (monitor) => {
      if (monitor.didDrop()) {
        this.fireAction(monitor.getItem());
      }
    }
  });
  collected$ = itemSource.collect(monitor => ({
    isDragging: monitor.isDragging(),
  }));
  constructor(private dnd: DndService) {}
  fireAction(item) { /* ... */ }
  ngOnDestroy() { this.itemSource.destroy(); }
}
```

### No higher-order components

Props are a React concept, similar to `Input()` in Angular. The primary
difference relevant to us is that in React you can create a 'wrapper' or
'higher-order' component that will pass all of its props to the one it is
'wrapping' or 'decorating', with extra behaviour or new props added. This is how
`react-dnd` works; wrap your component with `@DragSource(type, spec, collect:
(connect, monitor) => Object)`, where the output of the  `collect` function is
injected into your component's props.

_In Angular, we run everything inside your component_, using methods on an
injected `DndService` to create **connections**. Connections are a go-between for the
subscribing to the global drag state and can be connected to DOM elements. You
can create more than one connection for a component, to accomplish what the
`react-dnd` docs refer to as composing multiple decorators together.

There are four other ways this approach makes for different-looking but
similar-functioning code.

### 1. No `props` or `component` arguments in the `spec` callbacks

There are no props in Angular, as discussed above. Instead, all inputs to a component
or properties relevant to the template are declared on the component class.
Therefore, using `this` is appropriate instead. That also makes `component`
moot, since it would also refer to `this`. Therefore, all of the callbacks on the
two `*Spec` interfaces have only `monitor` as an argument.

One thing to be aware of is that to access `this` on an object you pass
elsewhere, you **must use Arrow notation: `(arrow) => this.notation;`** for your
spec callbacks.

### 2. `react-dnd` `connectDragSource` (etc) functions vs Angular directives

In the example above, `connect.connectDragSource()` returns a function that will
link up a particular part of the JSX template's DOM to the wrapper component. To
accomplish the same thing in Angular we must connect some DOM from the template
to a Connection object. The Angular Way to do this is with a directive, which
connects the DOM from its injected `ElementRef`. The Angular translation above
uses `[dragSource]="itemSource"` on the same part of the template as the React
code does.

Some React examples will have two different drag sources + associated connectors
(on different DOM elements), or one source and one `connectDragPreview`. Angular
can do both, because each directive is linked to one Connection.

### 3. Why is that React `type` argument in the Spec in Angular?

Imagine you want to make a component draggable based on type(s) specified on the
component inputs.

`react-dnd` allows strings and ES6 Symbols in the type argument. But you can
_also_ pass a function  of `(props) => string|symbol`; in this way, your item
types can depend on the inputs to your component, and even change over time when
the props change. It's not a plain asynchronous callback like the rest of the
spec, because it has to be called when props change.

The equivalent place to do this in Angular is `ngOnChanges()`, so you have to
supply _no type_ and fill it in later as the `@Input()` property is populated.
[[[package-name]]] will defer connecting the DOM and the subscription to the
`monitor` until this is done. Example:

```typescript
@Input() type: string|symbol;
source = this.dnd.dragSource({
  beginDrag: () => ({ ... })
})
ngOnChanges() {
  this.source.setType(this.type);
}
```

It may be more convenient or easier to understand if you write:

```typescript
@Input() set type(t) {
  this.source.setType(t);
}
source = this.dnd.dragSource({
  beginDrag: () => ({ ... })
})
```

### 4. You must destroy the connection object when you are done with it.

In React, this is managed by the wrapper component. In Angular, you have to do
it yourself. See [[[ref: Connection.destroy()]]]


## API Reference

### All `Connection` objects

#### `destroy()`

This method **MUST** be called, however you choose to, in `ngOnDestroy()`. If you
don't, you will leave subscriptions hanging around that will fire callbacks on
components that no longer exist.

#### The `takeUntil: Observable<any>` parameter

TODO: rename the parameter

If your components have lots of subscriptions, a common pattern is to create an
RxJS Subject called `destroy$`, to use
`Observable.takeUntil(destroy$).subscribe(...)` and to call `destroy.next()` once
to clean up all of them. [[[package-name]]] supports this pattern with the
`takeUntil` parameter. Simply:

```typescript
destroy$ = new Subject<void>();
target = this.dnd.dropTarget({
  /* spec */
}, destroy$);
```

### `DndService.dragSource(spec, takeUntil?)`

This method creates a `DragSourceConnection` object that represents a drag
source and its behaviour, and can be connected to a DOM element by assigning it
to the `[dragSource]` directive on that element in your template. It is the
corollary of [`react-dnd`'s
`DragSource`](http://react-dnd.github.io/react-dnd/docs-drag-source.html).

Like `dropTarget(...)` below, it can be used just for subscribing to drag state
information related to a particular item type or list of types. You do not have
to connect it to a DOM element if that's all you want. See the `collect()`
method.

#### `spec: DragSourceSpec`

The `spec` argument is a set of _queries_ and _callbacks_ that are called at
appropriate times by the internals. The queries are for asking your component
whether to drag/listen and what item data to hoist up; the callback (just 1) is for notifying you
when the drag ends.

```
interface DragSourceSpec {
  type?:       string | symbol;
  // queries
  beginDrag:   (monitor: DragSourceMonitor) => {} & any;
  canDrag?:    (monitor: DragSourceMonitor) => boolean;
  isDragging?: (monitor: DragSourceMonitor) => boolean;
  // callback
  endDrag?:    (monitor: DragSourceMonitor) => void;
}
```

##### `type?`

*Usually required.* Either a string or an ES6 symbol. (Create
a symbol with `Symbol("some text")`.)

Only the drop targets registered for the same type will react to the items
produced by this drag source.

If you wish to have a dynamic type based on an `@Input` property, for example,
you must call `Connection.setType()` in either of your component's `ngOnInit` or
`ngOnChanges` methods. You might use this to emit a type based on an `@Input()`
property:

```typescript
@Input() type: string;
@Input() model: { parentId: number; name: string; };

target = this.dnd.dragSource({
  /* ... don't set the types. ... */
});

ngOnChanges() {
  // use what your parent component told you to
  this.target.setType(this.type);
  // or create groupings on the fly
  this.target.setType("PARENT_" + this.model.parentId.toString());
}
```

##### `beginDrag: (monitor: DragSourceMonitor) => {} & any`

Required. When the dragging starts, `beginDrag` is called. You must return a plain
JavaScript object describing the data being dragged. What you return is the *only*
information available to the drop targets about the drag source so it's
important to pick the minimal data they need to know. You may be tempted to put
a reference to the component into it, but you should try very hard to avoid
doing this because it couples the drag sources and drop targets. It's a good
idea to return something like `{ id: props.id }` from this method.

##### `canDrag: (monitor: DragSourceMonitor) => boolean`

Optional. Use it to specify whether the dragging is currently allowed. If you
want to always allow it, just omit this method. Specifying it is handy if you'd
like to disable dragging based on some predicate over props. *Note: You may not
call `monitor.canDrag()` inside this method.*

##### `isDragging: (monitor: DragSourceMonitor) => boolean`

Optional. By default, only the drag source that initiated the drag operation is
considered to be dragging. You can override this behavior by defining a custom
`isDragging` method. It might return something like `props.id ===
monitor.getItem().id`. Do this if the original component may be unmounted during
the dragging and later "resurrected" with a different parent. For example, when
moving a card across the lists in a Kanban board, you want it to retain the
dragged appearance—even though technically, the component gets unmounted and
a different one gets mounted every time you move it to another list. *Note: You
may not call `monitor.isDragging()` inside this method.*

#### `setType(type: string|symbol)`

This sets the type to both emit and subscribe to. If no type has previously been
set, it creates the subscription and allows the `[dragSource]` DOM element to be
connected. If you do not need to dynamically update the type, you can set it once
via the `DragSourceSpec.type` property.

#### `connect( fn: (c: DragSourceConnector) => void )`

This function allows you to connect a DOM element to your
`DragSourceConnection`. It is formulated as a callback so that connecting may be
deferred until the connection has a type. You will usually not need to call this
directly; it is more easily handled by the directives.

##### `DragSourceConnector`

###### `dragSource(elementOrNode, options?)`

This connects a DOM `element` or node as a drag source. You may use an
`ElementRef.nativeElement`, or even an
[`Image`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image).

There is only one option on `options?: DragSourceOptions`:

* `dropEffect?: 'copy' | 'move' | 'link' | 'none'`: Optional. A string. By
default, 'move'. In the browsers that support this feature, specifying 'copy'
shows a special "copying" cursor, while 'move' corresponds to the "move" cursor.
You might want to use this option to provide a hint to the user about whether an
action is destructive.

##### Options for `DragPreviewConnector`

* `captureDraggingState`: Optional. A boolean. By default, false. If true, the
component will learn that it is being dragged immediately as the drag starts
instead of the next tick. This means that the screenshotting would occur with
`monitor.isDragging()` already being true, and if you apply any styling like
a decreased opacity to the dragged element, this styling will also be reflected
on the screenshot. This is rarely desirable, so false is a sensible default.
However, you might want to set it to true in rare cases, such as if you want to
make the custom drag layers work in IE and you need to hide the original element
without resorting to an empty drag preview which IE doesn't support.

  * For doing this all in one go (blank image + `captureDraggingState` + hide
    element with CSS) check out the `[noDragPreview]` directive with
    `[hideCompletely]="true"`.

* `anchorX`: Optional. A number between 0 and 1. By default, 0.5. Specifies how
the offset relative to the drag source node is translated into the the
horizontal offset of the drag preview when their sizes don't match. 0 means
"dock the preview to the left", 0.5 means "interpolate linearly" and 1 means
"dock the preview to the right".

* `anchorY`: Optional. A number between 0 and 1. By default, 0.5. Specifies how
the offset relative to the drag source node is translated into the the vertical
offset of the drag preview when their sizes don't match. 0 means "dock the
preview to the top, 0.5 means "interpolate linearly" and 1 means "dock the
preview to the bottom."

* `offsetX`: Optional. A number or null if not needed. By default, null.
Specifies the vertical offset between the cursor and the drag preview element.
If `offsetX` has a value, `anchorX` won't be used.

* `offsetY`: Optional. A number or null if not needed. By default, null.
Specifies the vertical offset between the cursor and the drag preview element.
If `offsetY` has a value, `anchorY` won't be used. 

### `DndService.dropTarget(spec, takeUntil?)`

Creates a `Connection` object that represents a drop target and its behaviour,
and can be connected to a DOM element by assigning it to the `[dropTarget]`
directive on that element in your template.
This is the corollary of [`react-dnd`'s `DropTarget`](http://react-dnd.github.io/react-dnd/docs-drop-target.html).

Like `dragSource(...)` above, it can be used just for subscribing to drag state
information related to a particular item type or list of types. You do not have
to connect it to a DOM element if that's all you want. See the `collect()`
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
