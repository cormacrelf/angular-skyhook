## Installation

```sh
yarn add @angular-skyhook/core react-dnd-html5-backend
```

You might consider `@angular-skyhook/multi-backend` instead of the HTML5
backend, because it allows adding touch support as well.

Then import `SkyhookDndModule` and provide the backend:


```typescript
import { SkyhookDndModule } from "@angular-skyhook/core";
import { default as HTML5Backend } from 'react-dnd-html5-backend'

@NgModule({
  imports: [
    // Don't forget the forRoot()
    SkyhookDndModule.forRoot({ backend: HTML5Backend }),
  ]
})
export class AppModule {}
```

If you need it again on a child module, like a lazy-loaded module, you only need
to import `SkyhookDndModule` there. That way the backend and global drag state is only
initialized once. But you may use `forRoot`to inject a new instance or to
include drag and drop on only some child modules.

When installing backends originally made for React (they all use default
exports), __make sure you use this syntax:__

__`import { default as XXX } from '...'`__

... because Angular in AOT mode cannot do `import XXX from '...'`
directly.

## Concepts

These pieces make up the library:

1.  An **item** (JS Object, not a DOM node) is the source of truth for each drag
    operation
2.  A **drag source** registers a DOM node to commence drag operations
3.  A **drop target** registers a DOM node for hover and drop events
    while dragging
4.  A way for each to provide, listen for and query changes in the drag state:
    a **monitor** and appropriate callbacks
5.  Hooks to provide some other DOM element as the drag preview.

`react-dnd` defined one more thing, inspired by HTML5, to make using this sane:
each **item** has a **type**, and drag sources and drop targets will
respectively emit and accept only items with matching types.

That's it. This library offers all those concepts in an Angular-friendly way,
that is also largely compatible with a lot of `react-dnd` code and examples.

## Next steps

* Have a look at the [Examples](../examples/index.html), and browse their source code in the
[examples app on GitHub][examples-src].

* Read and follow the [Tutorial](tutorial.html)

* Read the 3-part [guide](guide.html) in the sidebar. Any specifics are available by browsing the interfaces and
  classes.

[examples-src]: https://github.com/cormacrelf/angular-skyhook/tree/master/packages/examples/src/app/


## Touch support and alternate backends

Mobile devices have not implemented HTML5 drag and drop. You will need:

- A different backend using click or touch events, without dropping desktop support
- A way to render drag previews. Where on desktops you
can let the browser render drag previews, when using a backend based on click
or touch events, on mobile you have to render them yourself.

A good way to solve both problems at once is using
[`@angular-skyhook/multi-backend`][skyhook-multi]. It is based on the original
[dnd-multi-backend][dnd-multi-backend], which was designed to seamlessly switch
between an HTML5 and a [touch backend][touch-backend] when it noticed different
kinds of interaction. The `@angular-skyhook` version includes a preview component.

[skyhook-multi]: ../@angular-skyhook/multi-backend/
Note also that you will need to use an exported function
to provide the backend, to retain AOT compatibility, if it requires assembly.
`MultiBackend`, for example, can be used like so:

```typescript
export function createBackend() {
    return MultiBackend(HTML5ToTouch);
}
@NgModule({
  imports: [
    SkyhookDndModule.forRoot({ backendFactory: createBackend })
  ]
}
// ...
```

[touch-backend]: https://github.com/yahoo/react-dnd-touch-backend
[dnd-multi-backend]: https://github.com/LouisBrunner/react-dnd-multi-backend


## Troubleshooting

### I get `TypeError: backend is null`, only when AOT is enabled

Also rears its head as `No such property 'default' of undefined`.

**Troubleshooting steps**

1.  Check you are importing the backend and renaming any default exports.

    ```
    import { default as HTML5Backend } from 'react-dnd-html5-backend';
    import { SomeImaginaryBackendWithNamedExports } from 'some-imaginary-backend';
    ```

    Generally, make sure you are importing the backend correctly. If it does not
    provide Typescript definitions, you might have to read the documentation or
    browse the source code.

2.  Make sure in your root Angular module (usually `app.module.ts`) you import
    `SkyhookDndModule.forRoot({ backend: MyBackend })` instead of plain `SkyhookDndModule`.

### I get `Error encountered resolving symbol values statically. Calling function 'default'` with AOT enabled.

Make sure you are following the special instructions for assembly-required backends
like `MultiBackend` or any backend that allows `SomeBackend({ optionsHere: true })`,
like `TouchBackend`. [See above](#touch-support-and-alternate-backends).

### In the spec callbacks, my component doesn't have any properties, and it can't call `this.method()`!

Make sure you use the arrow function syntax (`() =>`) in your specs so `this` will refer to your component. Example:

```typescript
paperCount = 3;
limitedSupplyOfPaper = this.dnd.dragSource("PAPER", {
    // use shorthand for one-liners that return a value
    canDrag: () => this.paperCount > 0,
    endDrag: (monitor) => {
        if (monitor.didDrop()) {
            this.paperCount--;
        }
    }
});
```

[This demo](https://goo.gl/VYQMEs) shows comprehensively what `this` refers to
in arrow functions vs regular ones. A sufficiently advanced editor shouldn't
show any completions at `this.|` in a regular function, as it will resolve the
type of `this` to be `any`.



