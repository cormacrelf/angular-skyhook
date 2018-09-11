# Translating React Code


There are many code examples and libraries on the web written for `react-dnd`,
the most important of which is the actual [`react-dnd`
documentation](http://react-dnd.github.io/react-dnd/docs-overview.html). In the
interest of making them useful or at least understandable, this library presents
a fairly similar API to the original. There are, of course, some differences
mandated by the style and limitations of React and Angular. We will illustrate
this with the `react-dnd` `DragSource` compared to `@angular-skyhook`'s
`SkyhookDndService.dragSource()`. Here are the [original API
docs](http://react-dnd.github.io/react-dnd/docs-drag-source.html) on
`DragSource`; the following is a small but complete example for a quick
reference. If you know how to use `react-dnd` already, then this should show you
most of it. If you don't know `react-dnd`, this will help you read [the example
code demos][react-examples] in the `react-dnd` documentation.

[react-examples]: http://react-dnd.github.io/react-dnd/examples-chessboard-tutorial-app.html

Here's a basic example in React:

```javascript
let itemSourceSpec = {
  beginDrag: (props, monitor) => {
    return { someProperty: props.someProperty };
  },
  endDrag: (props, monitor, component) => {
    if (monitor.didDrop()) {
      component.fireAction(monitor.getItem());
    }
  }
}
@DragSource("ITEM", itemSourceSpec, (connect, monitor) => ({
  connectDragSource: connect.connectDragSource(),
  isDragging: monitor.isDragging(),
}))
export class MyComponent extends React.Component {
  fireAction() { /* ... */ }
  render() {
    const { someProperty, isDragging } = this.props;
    return connectDragSource(
      <div>
        {someProperty}
        {isDragging ? 'I am being dragged now' : null}
      </div>
    );
  }
}
```

And here's the Angular translation:

```typescript
@Component({
  template: `
```

```html
  <div [dragSource]="itemSource">
    {{someProperty}}
    <span *ngIf="(collected$|async).isDragging">
      I am being dragged now
    </span>
  </div>
  `
```

```typescript
})
export class MyComponent {
  @Input() someProperty: string;
  itemSource = dnd.dragSource("ITEM", {
    beginDrag: (monitor) => {
      return { someProperty: this.someProperty };
    },
    endDrag: (monitor) => {
      if (monitor.didDrop()) {
        this.fireAction(monitor.getItem());
      }
    }
  });
  collected$ = this.itemSource.listen(monitor => ({
    isDragging: monitor.isDragging(),
  }));
  constructor(private dnd: SkyhookDndService) {}
  fireAction(item) { /* ... */ }
  ngOnDestroy() { this.itemSource.destroy(); }
}
```

As you can see, the two are very similar. You should be able to take most
React/`react-dnd` examples and translate them quite directly into Angular. You
can _almost_ copy and paste some parts.

### 1. Biggest difference: Connections instead of Higher-Order Components

There is a React concept of 'props', similar to `Input()` in Angular. The
primary difference relevant to us is that in React you can create a 'wrapper' or
'higher-order' component that will pass all of its props to the one it is
'wrapping' or 'decorating', with extra behaviour or new props added. This is how
`react-dnd` works: wrap your component with `@DragSource(type, spec, collect:
(connect, monitor) => Object)`, and the output of the  `collect` function is
injected into your component's props.

_In Angular, we run everything inside your component_, using methods on an
injected `SkyhookDndService` to create **connections**. Connections are a go-between
for subscribing to the global drag state and can be connected to DOM
elements. This difference is typical of the React Way and the Angular Way. You
can create more than one connection for a component, to accomplish the same
thing as composing multiple decorators in `react-dnd`.

There are five other ways this approach makes for slightly different-looking but
very similar-functioning code.

### 2. You must destroy the connection object when you are done with it.

In React, this is managed by the wrapper component. In Angular, you have to do
it yourself. See `ConnectionBase.unsubscribe`.


### 3. No `props` or `component` arguments in the `spec` callbacks

There are no props in Angular, as discussed above. Instead, all inputs to a component
or properties relevant to the template are declared on the component class.
Therefore, using `this` is appropriate instead. That also makes `component`
moot, since it would also refer to `this`. Therefore, all of the callbacks on the
two `*Spec` interfaces have only `monitor` as an argument.

One thing to be aware of is that to access `this` in an function you pass
elsewhere, you **must use Arrow notation: `(arrow) => this.notation;`** for your
spec callbacks.


### 4. Information about current drag state comes through an Observable

In `react-dnd` the `collect((props, monitor) => {})` function supplies the
component props 'from above'. In Angular (here, `DragSource.listen`), the
library gives you an Observable you can subscribe to in your template. The
example above creates an Object `{ ... }` and subscribes to it all in one go
(the internals make this efficient), but you are free to do `listen(m =>
m.isDragging())`, with one subscription for each interesting value. You might
combine information from two different connections using
`Observable.combineLatest`, for example.

I found the terms `connect` and `collect` far too similar and confusing, so
I renamed `collect` to `listen`.

### 5. `connectDragSource()` (etc.) functions vs Angular directives

In the example above, `connect.connectDragSource()` returns a function that will
link up a particular part of the JSX template's DOM to the wrapper component. To
accomplish the same thing in Angular we must connect some DOM from the template
to a Connection object. The Angular Way to do this is with a __directive__,
which connects to the DOM via its injected `ElementRef`. The Angular translation
above uses `[dragSource]="itemSource"` on the same part of the template as the
React code does.

Some React examples will have two different drag sources + associated connectors
(on different DOM elements), or one source and one `connectDragPreview`. Angular
can do both patterns with directives, because each directive is linked to one Connection.

### 6. Can't supply a dynamic type via a `(props) => props.type` callback, use `setType` instead

Imagine you want to make a component draggable based on type(s) specified on the
component inputs.

`react-dnd` allows strings and ES6 Symbols in the type argument. But you can
_also_ pass a function  of `(props) => string|symbol`; in this way, your item
types can depend on the inputs to your component, and even change over time when
the props change. It's not a plain asynchronous callback like the rest of the
spec, it is called when the props change on the decorating component, before any
asynchronous drag operations start. Angular doesn't have a way for arbitrary
objects to listen to `ngOnChanges()`, so we have to do it manually.

You can supply a default type, or `null`, and update it in later as the
`@Input()` property is populated. If you supply `null`, `@angular-skyhook` will
defer connecting the DOM and the subscription to the `monitor` until this is
done. See `DragSource.setType` for more information.

