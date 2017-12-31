## Tutorial: Chessboard

In this tutorial, we're building a tiny chess game, with one knight on the
board. It's a plain translation of the original [`react-dnd` tutorial][orig].
Almost all the thinking about how to break down this game into components is
worth reading the original for. We will carry on implementing the three
components:

* `Knight`, responsible for rendering one knight piece
* `Square`, just one black or white square on the board
* `Board`, 64 squares.

[orig]: http://react-dnd.github.io/react-dnd/docs-tutorial.html

### Basic components

> For the first part, we will build up to [this commit][initial]. If you're
copying that reference code as a starting point, make sure to import
`DndModule.forRoot(yourBackend)` instead of `DndModule`, because the reference
code is part of the larger example project that already has a backend.

[initial]: https://github.com/cormacrelf/angular-hovercraft/tree/3ba487e06866a5035355b417ae51b58505d5ea27/packages/examples/src/app/chessboard

We'll build the `Knight` first. It is very simple, just a span with a Unicode
knight character in it.

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-knight',
    template: `<span>♘</span>`,
    styles: [`
    span {
        font-weight: 700;
        font-size: 54px;
    }
    `]
})
export class Knight {
}
```

Add this component to your module's `declarations` section, and put
`<app-knight></app-knight>` somewhere on your page.

![A lonely knight](media://lone-knight.png)

Next, we will implement `Square`. It is responsible only for changing the colour
of the background and foreground depending on a `black` input, and rendering
whatever was passed to it inside its tags. Make a `Square` component, add it to
your module, and include the following very simple HTML template:

```html
<div [ngStyle]="getStyle()">
  <ng-content></ng-content>
</div>
```

In the body of the component class, add an input for whether the square should
be black or not:

```typescript
@Input() black: boolean;
```

Then implement `getStyle()` by reading this property.


```typescript
getStyle() {
    return this.black
        ? { backgroundColor: 'black', color: 'white' }
        : { backgroundColor: 'white', color: 'black' }
}
```

Note that by attaching these styles directly via `[ngStyle]`, they are not
affected by Angular's view encapsulation, so `color` will apply to any child
components as well. You could achieve the same by using classes and CSS and
`::ng-deep` or turning view encapsulation off.

Then, we want `Square` to take up all the space available to it. This way,
Square can be arbitrarily large, and we don't have to worry about how big the
whole board is going to be. Include the following in a `styles` block, or
a linked CSS file.

```css
:host, div {
    display: block;
    height: 100%;
    width: 100%;
    text-align: center;
}
```

At this point, you can render one square with a knight in it, like so:

```html
<app-square [black]="true">
    <app-knight></app-knight>
</app-square>
```

![One square, with a knight in it](media://one-square.png)


If you're paying attention, you'll notice that `height: 100%` doesn't really
mean anything (in Angular, you can't render directly to the `body` tag), but it
will make sense later when we put the Square in a `div` that has an absolute
height.

Then, let's build the board. Start by building out a component that just renders
one square.

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-board',
    template: `
    <div>
        <app-square [black]="true">
            <app-knight></app-knight>
        </app-square>
    </div>
    `
})
export class Board {
}
```

Now, we need to render 64 of them. We will need an `*ngFor`, but Angular isn't
very good at for loops, so we have to make an array of 64 items.


```html
<div *ngFor="let i of sixtyFour">
    <app-square [black]="true">
        <app-knight></app-knight>
    </app-square>
</div>
```

```typescript
// ...
export class Component {
    sixtyFour = new Array(64).fill(0).map((_, i) => i);
}
```

![Many knights in a vertical list](media://many-knights.png)


Then, you just have a lot of black squares in a vertical list. Not very chess-y.
To make it an 8x8 grid, we are going to wrap them all in a `<div
class="board">`, and use the cool new CSS feature, CSS Grid. Make sure you are
using a modern browser. Apply this style to the wrapping `.board`:

```css
.board {
    width: 100%;
    height: 100%;
    border: 1px solid black;
    display: grid;
    grid-template-columns: repeat(8, 12.5%);
    grid-template-rows: repeat(8, 12.5%);
}
```

For brevity's sake you could just set `.board` to a fixed `width` and `height`
of `560px`. I added a container component, just to specify that size, to keep
the board independent of where it will be placed. At this point, you will have
an 8x8 board, but it doesn't look like chess yet.

![An 8 by 8 grid of black squares](media://grid.png)


#### Making the chessboard pattern and placing one knight on the board

We're going to need a way to express coordinates on the board. Define a new
interface, to hold `x` and `y` coordinates.

```typescript
export interface Coord { x: number; y: number; }
```

Save it in a new file, and import it into your Board component file. Then, we
need to go from `0..63` (the indices of the `*ngFor`) to `Coord` objects.

```
export class Board {
    // ...
    xy = (i): Coord => ({
        x: i % 8,
        y: Math.floor(i / 8)
    });
}

```

You can then go from `Coord` to whether the square is black or not:

```typescript
    // ...
    isBlack = ({ x, y }: Coord) => (x + y) % 2 === 1;
```

Then, pass the result to each `Square`, and render only one `Knight` in the top
left:

```html
<div *ngFor="let i of sixtyFour">
    <app-square *ngIf="xy(i) as pos" [black]="isBlack(pos)">
        <app-knight *ngIf="pos.x === 0 && pos.y === 0"></app-knight>
    </app-square>
</div>
```

And look at that, we have a chess board with one knight.


![A chess board with one knight on it](media://chess-grid.png)


#### Making the knight move around

We can clearly represent the position of a knight in one `Coord` object. You
_could_ store this on the `Board` itself:

```html
<app-knight *ngIf="pos.x === knightPosition.x && pos.y === knightPosition.y"></app-knight>
```

```typescript
knightPosition: Coord = { x: 7, y: 4 };
```

But we're going to want to read this elsewhere and drive the game logic from it,
and we don't want all the game logic to be trapped inside the `Board` component.

So, create a `GameService`, and represent the changing position of the knight
with an RxJS `BehaviorSubject<Coord>`. This is an ultra-lightweight way of
building an `@ngrx`-style Store without any boilerplate. It allows us to
'broadcast' updates to the knight's position to any interested components.

Like any `Subject`, it can be used as an `Observable`, and components can
subscribe to it with the `| async` pipe. But unlike a regular `Subject`,
a `BehaviorSubject` can have an initial value, and will replay the most recent
value to any new subscribers. This is exactly what we want.

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface Coord { x: number; y: number; }

@Injectable()
export class GameService {

    knightPosition$ = new BehaviorSubject<Coord>({ x: 2, y: 5 });

    moveKnight(to: Coord) {
        this.knightPosition$.next(to);
    }

}
```

As you can see, this is a very simple service. Inject it into your `Board`
component, and let's put the Knight where the `GameService` says it should go.

```html
<app-knight *ngIf="pos.x === (knightPosition$|async).x && pos.y === (knightPosition$|async).y"></app-knight>
```

```typescript
    knightPosition$ = this.game.knightPosition$;
    constructor(private game: GameService) { }
```

This works, but it's a bit inefficient. There are going to be 128 subscribers to
the one `knightPosition$`, because we subscribed to it inside the `*ngFor`.
A better solution would be to put the entire `*ngFor` section in the scope of
one subscription. You can do that without introducing a redundant `<div>`, by
using `<ng-container>` and a fancy `*ngIf` trick. Since `knightPosition$|async`
is always truthy, you can put it in an `*ngIf` and give the result a name using
the `*ngIf="AAA as BBB"` syntax. Here's the entire template:

```html
    <div class="board">
        <ng-container *ngIf="knightPosition$|async as kp">
            <div class="square-container" *ngFor="let i of sixtyFour">
                <app-square *ngIf="xy(i) as pos" [black]="isBlack(pos)">
                    <app-knight *ngIf="pos.x === kp.x && pos.y === kp.y"></app-knight>
                </app-square>
            </div>
        </ng-container>
    </div>
```

The resulting compiled template is much more efficient.

Now that we have a `knightPosition$` and even a `GameService.moveKnight()`
function, we can hook up a click event on each `<app-square>` to move the knight around
the board. We're going to remove it later, so throw it in the `Board` component:

```html
<!-- ... -->
<app-square *ngIf="xy(i) as pos" [black]="isBlack(pos)" (click)="handleSquareClick(pos)">
<!-- ... -->
```

```typesccript
handleSquareClick(to: Coord) {
    this.game.moveKnight(to);
}
```

Click around, and your noble `Knight` will follow, even though he is breaking
the rules. So, let's add the rules. Amend the `GameService` to include
a `canMoveKnight` function, based on the current position and a prospective
position. You can store the `currentPosition` by subscribing internally to
`knightPosition$` and writing out each new value into an instance variable.

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface Coord { x: number; y: number; }

@Injectable()
export class GameService {

    knightPosition$ = new BehaviorSubject<Coord>({ x: 2, y: 5 });
    currentPosition: Coord;

    constructor() {
        this.knightPosition$.subscribe(kp => {
            this.currentPosition = kp;
        })
    }

    moveKnight = (to: Coord) => {
        this.knightPosition$.next(to);
    }

    canMoveKnight(to: Coord) {
        const { x, y } = this.currentPosition;
        const dx = to.x - x;
        const dy = to.y - y;

        return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
               (Math.abs(dx) === 1 && Math.abs(dy) === 2);
    }

}
```

Amend `handleSquareClick` to check the rules before executing the move:

```typesccript
handleSquareClick(to: Coord) {
    if (this.game.canMoveKnight(to)) {
        this.game.moveKnight(to);
    }
}
```

And voilà, your knight won't execute an illegal move. We will be replacing this
click handler in just a moment, but we have separated the game logic out, so we
can reuse these two functions.

### Implementing drag and drop

> At this point, your code should be very similar to [this commit][initial]. You
can start fresh from that point if you want to.

Take a moment to think about what we have to work with. We have:

* A `Knight` which we want to be able to drag,
* Many `Square`s on which he could be dropped,
* A way to express that state change (`GameService.moveKnight`),
* And a way to compute where we can drop him (`GameService.canMoveKnight`).

Out strategy for implementing drag and drop is this:

1. Make the knight draggable
2. Turn all the squares into drop targets
3. Only allow drops into squares where `canMoveKnight` returns `true`
4. On each successful drop, call `moveKnight`, and Angular will re-render with
   the new state.
5. Add some extra visuals to guide the interaction

If you have used other drag and drop libraries, this may seem a bit weird --
what happens to the Knight that we're dragging after we drop him? The answer is,
he disappears. After step 1, we will have a knight you can pick up, but nothing
interesting will happen when we let go, except that the preview will vanish. We
are going to do steps 3 and 4 on the drop targets, which are notified when you
drop something on them.

#### Part 1. Make the knight draggable

First, we need a type to describe what we're dragging, so that the squares can
listen for knights floating above them. Store a constant string `"KNIGHT"` in
a new file. This is better than typing the same string over and over, and serves
as a single place where all your different chess piece types are defined.

```typescript
// constants.ts
export const ItemTypes = {
    KNIGHT: "KNIGHT"
}
```

Then, make your `Knight` into a drag source.

1. Inject `DndService` into your `Knight` component
2. Create a dead simple drag source which emits `ItemTypes.KNIGHT`, and a simple
   `{}` to represent what's being dragged. We don't need any more information
   than that, but if you were doing >1 piece, you would have to specify _which
   knight_ was being dragged. This is where you'd do it.
3. Attach the drag source to the Knight's DOM element.
4. In `ngOnDestroy`, unsubscribe the drag source.

Here's all four in one go:

```typescript
import { Component } from '@angular/core';
import { DndService } from 'angular-hovercraft';
import { ItemTypes } from './constants';

@Component({
    selector: 'app-knight',
                     // step 3
    template: `<span [dragSource]="knightSource">♘</span>`,
    styles: [`
    span {
        font-weight: 700;
        font-size: 54px;
    }
    `]
})
export class Knight {
    // step 2
    knightSource = this.dnd.dragSource(ItemTypes.KNIGHT, {
        beginDrag: () => ({})
    });

    // step 1
    constructor(private dnd: DndService) { }

    // step 4
    ngOnDestroy() {
        this.knightSource.unsubscribe();
    }
}
```

Try dragging your little knight, and you'll find that you can. There aren't many
visual cues to help though. So let's listen to whether we are dragging the
knight, and make the UI respond to that.

1. Use the [[DragSource.listen]] and [[DragSourceMonitor.isDragging]] methods to
   get an observable `isDragging$` on your `Knight` component.
2. Use that observable in your template

```typescript
// component
// (this is an Observable<boolean>)
isDragging$ = this.knightSource.listen(monitor => monitor.isDragging());
```

```html
<!-- template -->
<span [dragSource]="knightSource" [class.dragging]="isDragging$|async">♘</span>
```

```css
/* in the style block */
.dragging {
    opacity: 0.25;
}
```

Now, the knight on the board will be a bit transparent when you've picked it up.
You could set it to `opacity: 0`, but in Chess we like to know where the piece
came from.


#### Part 2: Make the squares into drop targets

Because `canMoveKnight` has to be computed once per square, each square is going
to have to know where it is on the board. However, the `Square` component is
perfectly good at what it does. We don't want to ruin a good thing. Let's wrap
it with another component, `BoardSquare`, that will handle the drag and drop,
and leave the black and white rendering to `Square`. This is a basic wrapper
which preserves the size of the underlying squares:

```typescript
import { Component, Input  } from "@angular/core";

@Component({
    selector: 'app-board-square',
    template: `
    <div class="wrapper">
        <app-square [black]="black">
            <ng-content></ng-content>
        </app-square>
    </div>
    `, styles: [`
    :host, .wrapper {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
    }
    `]
})
export class BoardSquare {
    @Input() position: Coord;
    get black() {
         const { x, y } = this.position;
         return (x + y) % 2 === 1;
    }
}
```

Then, we're going to add a drop target and attach it to that wrapper `div`. It's
very similar to the drag source.

1. Inject `DndService`
2. Create a drop target
3. Attach it to the DOM
4. Unsubscribe it in `ngOnDestroy`.


```typescript
import { Component, Input  } from "@angular/core";
import { DndService } from 'angular-hovercraft';
import { ItemTypes } from "./constants";

@Component({
    selector: 'app-board-square',
    template: `
                         <!-- step 3 -->
    <div class="wrapper" [dropTarget]="target">
        <app-square [black]="black">
            <ng-content></ng-content>
        </app-square>
    </div>
    `, styles: [`
    :host, .wrapper {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
    }
    `]
})
export class BoardSquare {
    @Input() position: Coord;
    get black() {
         const { x, y } = this.position;
         return (x + y) % 2 === 1;
    }

    // step 2
    target = this.dnd.dropTarget(ItemTypes.KNIGHT, {

    });

    // step 1
    constructor(private dnd: DndService) { }

    // step 4
    ngOnDestroy() {
        this.target.unsubscribe();
    }

}
```

#### Parts 3 and 4: make the knight move around on drop


Next up is to incorporate the game logic, and to actually move the knight. We're
going to use two hooks in the drop target: [[DropTargetSpec.canDrop]] and
[[DropTargetSpec.drop]]. We have already done the heavy lifting for both in
`GameService`. Inject `GameService` in the constructor, and incorporate its
methods.


```typescript
    target = this.dnd.dropTarget(ItemTypes.KNIGHT, {
        canDrop: monitor => {
            return this.game.canMoveKnight(this.position);
        },
        drop: monitor => {
            this.game.moveKnight(this.position);
        }
    });

    constructor(private dnd: DndService, private game: GameService) {}
```

Now you should be able to drag your knight around the board!

#### Part 5: Extra visuals

--------------

```typescript
import { Component, Input  } from "@angular/core";
import { Coord, GameService } from "./game.service";
import { DndService } from 'angular-hovercraft';
import { ItemTypes } from "./constants";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-board-square',
    template: `
    <div class="wrapper" [dropTarget]="target">
        <app-square [black]="black">
            <ng-content></ng-content>
        </app-square>
        <div class="overlay" *ngIf="showOverlay$|async" [ngStyle]="overlayStyle$|async"></div>
    </div>
    `, styles: [`
    :host, .wrapper {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
    }
    `]
})
export class BoardSquare {
    @Input() position: Coord;
    get black() {
         const { x, y } = this.position;
         return (x + y) % 2 === 1;
    }

    // This is the core of the dragging logic!
    target = this.dnd.dropTarget(ItemTypes.KNIGHT, {
        canDrop: monitor => {
            return this.game.canMoveKnight(this.position);
        },
        drop: monitor => {
            this.game.moveKnight(this.position);
        }
    });

    collected$ = this.target.listen(m => ({
        canDrop: m.canDrop(),
        isOver: m.isOver(),
    }));
    
    showOverlay$ = this.collected$.pipe(map(c => c.isOver || c.canDrop));

    overlayStyle$ = this.collected$.pipe(map(coll => {
        let { canDrop, isOver } = coll;
        let bg: string = "rgba(0,0,0,0)";
        if (canDrop && isOver) { bg = 'green'; }
        else if (canDrop && !isOver) { bg = 'yellow'; }
        else if (!canDrop && isOver) { bg = 'red'; }
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: bg
        }
    }));

    constructor(private dnd: DndService, private game: GameService) { }

    ngOnDestroy() {
        this.target.unsubscribe();
    }

}
```

