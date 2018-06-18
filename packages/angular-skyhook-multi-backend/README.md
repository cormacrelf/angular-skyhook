### Go back to [`angular-skyhook`](../)

# `angular-skyhook-multi-backend`

[![npm](https://img.shields.io/npm/v/angular-skyhook-multi-backend.svg)](https://www.npmjs.com/package/angular-skyhook-multi-backend)

This package does two things.

First, it re-exports [`dnd-multi-backend`][dnd-multi-backend], [`react-dnd-touch-backend`][touch-backend] and [`react-dnd-html5-backend`][html5-backend].

[html5-backend]: https://github.com/react-dnd/react-dnd
[touch-backend]: https://github.com/yahoo/react-dnd-touch-backend
[dnd-multi-backend]: https://github.com/LouisBrunner/react-dnd-multi-backend

Second, it gives you a convenient and easy way to render previews for when the touch backend is in use.

## Installation

```sh
yarn add angular-skyhook-multi-backend
```

Then change your `SkyhookDndModule` backend to a **`backendFactory`** like so:


```typescript
import { createDefaultMultiBackend } from 'angular-skyhook-multi-backend';

@NgModule({
  imports: [
    // ...,
    SkyhookDndModule.forRoot({ backendFactory: createDefaultMultiBackend })
  ]
})
export class AppModule
```

## Normal usage

You will want to render previews. The `<skyhook-preview>` component is very helpful.

1. Create a `<skyhook-preview>`
2. Add an `<ng-template>` inside, pulling in the item's type as `let-type`, and the item as `let-item="item"`.
3. Render whatever you want based on that information.

A suggested arrangement is using an `[ngSwitch]` directive on the type, with one `*ngSwitchCase` per type.

```html
<skyhook-preview>
  <ng-template let-type let-item="item">
    <ng-content [ngSwitch]="type">

      <div *ngSwitchCase="'TYPE'">{{ item | json }}</div>

      <your-component *ngSwitchCase="'OTHER_TYPE'">{{ item | json }}</your-component>

      <ng-content *ngSwitchCase="'THIRD_TYPE'">
        ...
      </ng-content>

    </ng-content>
  </ng-template>
</skyhook-preview>
```

If you don't like putting reusable strings directly in templates, then try this:

```typescript
// item-types.ts
export const ItemTypes = {
    TYPE: 'TYPE',
    OTHER_TYPE: 'OTHER_TYPE',
    THIRD_TYPE: 'THIRD_TYPE'
}
```

```typescript
// your-component.ts
import { ItemTypes } from './item-types';
@Component({
    template: `
    ... <div *ngSwitchCase="ItemTypes.OTHER_TYPE"> ... </div>
    `
})
export class YourComponent {
    // make ItemTypes a property on the class
    ItemTypes = ItemTypes;
}
```

## Using the preview component even in HTML5 mode

Sometimes, it is desirable to render a totally custom drag preview even in
desktop browsers. This might be because some browsers only show a small
feathered section of a larged dragged element, or just because you want to show
something different while an item is in flight. You will need two things:

### 1. An empty HTML5 drag preview

You can attach an empty image as your drag preview. Simply:

```typescript
import { getEmptyImage } from 'react-dnd-html5-backend';
// ...

source.connectDragPreview(getEmptyImage());

```

### 2. Disable the touch-backend-only check in the preview component

Simply pass allBackends as true to the preview.

```html
<skyhook-preview [allBackends]="true">
  ...
</skyhook-preview>
```

## Custom backends and transitions

You can also import anything from `dnd-multi-backend` and create your own
transitions. Refer to the original documentation, or simply to the autocomplete
through the re-exported types in this package.

Remember that you will need to create an exported function and pass it as a
`backendFactory` if you want to continue using Angular AOT compilation.

