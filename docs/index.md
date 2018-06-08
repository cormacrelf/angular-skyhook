[![Build Status](https://travis-ci.org/cormacrelf/angular-skyhook.svg?branch=master)](https://travis-ci.org/cormacrelf/angular-skyhook) 
[![npm](https://img.shields.io/npm/v/angular-skyhook.svg)](https://www.npmjs.com/package/angular-skyhook)
[![GitHub](https://img.shields.io/github/stars/cormacrelf/angular-skyhook.svg?style=social&label=Stars)](https://github.com/cormacrelf/angular-skyhook/)

`angular-skyhook` is a powerful set of tools and directives for building
complex drag and drop interfaces. It is based on, and very similar to
[`react-dnd`][react-dnd] by [Dan Abramov][gaearon] and others, shares many
of the underlying abstractions and is also powered by [`dnd-core`][dnd-core].

[react-dnd]: https://react-dnd.github.io/react-dnd/
[gaearon]: https://github.com/gaearon
[dnd-core]: https://github.com/react-dnd/react-dnd/tree/master/packages/dnd-core

### Installation

```sh
npm install angular-skyhook
npm install react-dnd-html5-backend
```

Next, follow the [[0-Quickstart]] and check out the [[Tutorial]].

### Features

* Make any component draggable, or into a drop target.
* Doesn't mutate the DOM, doesn't use classes and CSS to do 'callbacks'.
  The truth lives in JavaScript, with unidirectional data flow (like
  [`@ngrx/store`](ngrx)) and Observable APIs.
* Works with HTML5 drag and drop
* Covers up platform quirks
* Largely possible to translate `react-dnd` code or examples into Angular (see
  [[Translating-React-Code]])

[ngrx]: https://github.com/ngrx/ngrx-platform

### Non-Goals

We share the same non-goals as `react-dnd`:

> React DnD gives you a set of powerful primitives, but it does not contain any
> readymade components. It's lower level than [jQuery UI][jqui] or
> [interact.js][interactjs] and is focused on getting the drag and drop
> interaction right, leaving its visual aspects such as axis constraints or
> snapping to you. For example, React DnD doesn't plan to provide a Sortable
> component. Instead it makes it easy for you to build your own, with any
> rendering customizations that you need.

[jqui]: https://jqueryui.com/
[interactjs]: http://interactjs.io/

### Goals

Instead of building maximally-ergonomic solutions to simple use cases,
`react-dnd` and `angular-skyhook` provide a near-complete abstraction of
anything you could want to do with drag and drop. They are lower-level building
blocks that make it easy to implement some very complex interactions. They
assign no specific meaning to a drag/drop operation. You get to define what
happens when a drag starts or ends or hovers. Here are some ambitious examples:

* The [traditional `react-dnd` tutorial](http://react-dnd.github.io/react-dnd/examples-chessboard-tutorial-app.html), a chess board with movable pieces and rules
* Deleting items by dragging them to a 'trash can', like in the macOS dock.
* Stamping out a template by dragging the template into a work area
* Merging two items by dragging one on top of the other
* Hover over a 'folder' for a few seconds to 'drill down' into it
* The famous lists and cards on [trello.com](https://trello.com), which actually uses `react-dnd`
* A diagramming tool where you can draw links between nodes
* A 2D CAD program
* A graphical query builder, or visual data pipeline like [Luna](http://www.luna-lang.org/)
* [Many other demonstrations of `react-dnd` (most with GIFs) in use](https://github.com/react-dnd/react-dnd/issues/384)

### Alternatives

It is important to note that for bare-bones sortable lists, where you have
a mutable array of simple values, you don't necessarily need the superpowers in
this library. There are plenty of cookie-cutter solutions out there, like the
quite-powerful [`ng2-dnd`][ng2-dnd] or [`ng2-dragula`][ng2-dragula], which may
get you to your deadline faster than learning and using `angular-skyhook`. But
be warned; you may find yourself wanting more dragging power once you get
a taste. In fact, this package was born out of maintaining `ng2-dragula` and
watching users struggle to implement what `react-dnd` was born for.

[ng2-dnd]: https://github.com/akserg/ng2-dnd
[ng2-dragula]: https://github.com/valor-software/ng2-dragula

### Issues

Not all issues are `angular-skyhook`-related. If you think you found a bug in
`dnd-core` or with the HTML5 backend, those issues belong on [that
codebase](https://github.com/react-dnd/react-dnd) with their many contributors
and wealth of experience. If there is a problem with another backend you are
using, file an issue with that backend so you can get more specific help and so
that the community can benefit.

Issues and potential improvements to `angular-skyhook` are discussed on
[GitHub](https://github.com/cormacrelf/angular-skyhook).

### License

This library is released under the MIT license. It depends on `dnd-core`,
which is under the BSD license.
