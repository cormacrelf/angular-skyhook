# Testing

## Usage with Jest

See [The React DnD testing 
guide](https://react-dnd.github.io/react-dnd/docs/testing) for details about 
how to use dnd-core and react-dnd-test-backend with Jest. In particular, you 
will need to configure the `moduleNameMapper` as described there.

## Testing Components in Isolation

The Angular way of supplying drag state to components is not as easily testable 
as the React way. Currently it is not easy to isolate a component's rendering 
from the drag sources, drop targets and drag layers it listens to.

## The Test Backend

React DnD offers a test backend that does not require the DOM, and offers an 
API for easy simulation of drag and drop events. This is useful for testing an 
entire drag and drop interaction. (Imagine trying to construct the exact mouse 
events that represent a drag, just to do basic tests!) It is also useful as a 
lightweight no-op backend if you do not need to test the drag and drop 
interaction.

Install it with:

```
yarn add -D react-dnd-test-backend
```

Example usage (example component defined below):

```typescript
// Import the test backend
import { default as createTestBackend, TestBackend } from 'react-dnd-test-backend';
// We will need to find the DragDropManager to access the backend through
// dependency injection
import { SkyhookDndModule, DRAG_DROP_MANAGER } from "@angular-skyhook/core";

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe(MyComponent.name, () => {

    let component: MyComponent;
    let fixture: ComponentFixture<MyComponent>;

    // Use this backend to drive drag and drop interactions
    let backend: TestBackend;

    // We will store the handler ID for each, to pass to the test backend.
    let source: any;
    let target: any;

    // MyComponent should render differently while dragging
    const draggingClassApplied = () => {
        return fixture.debugElement.query(By.css('.dragging')) != null;
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                // supply the test backend when creating the testing module
                SkyhookDndModule.forRoot({ backend: createTestBackend })
            ],
            declarations: [MyComponent]
        })
    }));

    beforeEach(() => {
        // grab the manager
        const manager = TestBed.get(DRAG_DROP_MANAGER);
        // grab the backend off the manager
        backend = manager.getBackend();
        fixture = TestBed.createComponent(MyComponent);
        component = fixture.componentInstance;
        // the source and target handler IDs are available after change
        // detection
        fixture.detectChanges();
        source = component.source.getHandlerId();
        target = component.target.getHandlerId();
    });

    it('should drag and then drop', () => {
        // pick up the drag source
        backend.simulateBeginDrag([source]);

        // check that it rendered differently
        fixture.detectChanges();
        expect(draggingClassApplied()).toBeTruthy();

        // hover over the target
        backend.simulateHover([target]);
        // drop over the most recently hovered target(s)
        backend.simulateDrop();
        // complete the interaction
        backend.simulateEndDrag();

        fixture.detectChanges();
        expect(draggingClassApplied()).toBeFalsy();
    });

});
```

```typescript
import { Component } from '@angular/core';
import { SkyhookDndService } from '@angular-skyhook/core';
@Component({
template: `
    <div [dragSource]="source" [class.dragging]="isDragging$|async"></div>
    <div [dropTarget]="target"></div>
`
})
class MyComponent {
    source = this.dnd.dragSource("TEST", {
        beginDrag: () => ({}),
    });
    target = this.dnd.dropTarget("TEST", {});
    isDragging$ = this.source.listen(m => m.isDragging());
    constructor (private dnd: SkyhookDndService) {}
    ngOnDestroy() {
        this.source.unsubscribe();
        this.target.unsubscribe();
    }
}
```

