import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DndModule, DRAG_DROP_BACKEND } from '../angular-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MouseBackend from 'react-dnd-mouse-backend';
// import TouchBackend from 'react-dnd-touch-backend';
// import MultiBackend from 'react-dnd-multi-backend';
// import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';
// import { polyfill } from 'mobile-drag-drop';
// polyfill();

import { BinComponent } from './bin/bin.component';
import { TrashComponent } from './trash/trash.component';
import { SortedComponent } from './components/sorted/sorted.component';
import { CardComponent, CardInnerDirective } from './components/card/card.component';
import { CustomDragLayerComponent } from './custom-drag-layer/custom-drag-layer.component';
import { DraggableBoxComponent } from './draggable-box/draggable-box.component';
import { DragContainerComponent } from './drag-container/drag-container.component';
import { BoxComponent } from './box/box.component';
import { BoxDragPreviewComponent } from './box-drag-preview/box-drag-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    BinComponent,
    TrashComponent,
    SortedComponent,
    CardComponent,
    CardInnerDirective,
    CustomDragLayerComponent,
    DraggableBoxComponent,
    DragContainerComponent,
    BoxComponent,
    BoxDragPreviewComponent
  ],
  imports: [
    BrowserModule,
    DndModule.forRoot(),
  ],
  providers: [
    DndModule.provideBackend(HTML5Backend),
    // DndModule.provideBackend(MultiBackend(HTML5toTouch)),
    // DndModule.provideBackend(MouseBackend),
    // DndModule.provideBackend(TouchBackend({delayTouchStart: 100})),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
