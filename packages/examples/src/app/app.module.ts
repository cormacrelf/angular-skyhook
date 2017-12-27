import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DndModule } from 'angular-hovercraft';

/* Note:
 * Angular in AOT mode isn't capable of doing plain `import XXX from 'package-xxx'` imports.
 * Most existing backends follow the convention of doing default exports only, so in Angular
 * you should use `import { default as XXX } from 'package-xxx'` to import them.
 */
import { default as HTML5Backend } from 'react-dnd-html5-backend'

// some examples here

// import { default as MouseBackend } from 'react-dnd-mouse-backend';
// import { default as TouchBackend } from 'react-dnd-touch-backend';
// import { default as MultiBackend } from 'react-dnd-multi-backend';
// import { default as HTML5toTouch } from 'react-dnd-multi-backend/lib/HTML5toTouch';

import { SortedComponent } from './components/sorted/sorted.component';
import { CardComponent, CardInnerDirective } from './components/card/card.component';
import { CustomDragLayerComponent } from './custom-drag-layer/custom-drag-layer.component';
import { DraggableBoxComponent } from './draggable-box/draggable-box.component';
import { DragContainerComponent } from './drag-container/drag-container.component';
import { BoxComponent } from './box/box.component';
import { BoxDragPreviewComponent } from './box-drag-preview/box-drag-preview.component';
import { SourcesComponent, TargetBox, BlueOrYellowComponent } from './nested/sources';
import { PreloadAllModules } from '@angular/router';

let routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'bins' },
  { path: 'bins', pathMatch: 'full', loadChildren: './bins/index#Module' },
  { path: 'nested/sources', pathMatch: 'full', component: SourcesComponent },
  { path: 'nested/targets', pathMatch: 'full', loadChildren: './nested/targets/index#Module' },
  { path: 'customize/handles-previews', pathMatch: 'full', loadChildren: './customize/handles-previews/index#HandlesPreviewsModule' }
]

@NgModule({
  declarations: [
    AppComponent,
    SortedComponent,
    CardComponent,
    CardInnerDirective,
    CustomDragLayerComponent,
    DraggableBoxComponent,
    DragContainerComponent,
    BoxComponent,
    BoxDragPreviewComponent,
    BlueOrYellowComponent,
    SourcesComponent,
    TargetBox,
  ],
  imports: [
    BrowserModule,
    DndModule.forRoot(HTML5Backend),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true }),
  ],
  providers: [
    // DndModule.provideBackend(HTML5Backend),
    // DndModule.provideBackend(MultiBackend(HTML5toTouch)),
    // DndModule.provideBackend(MouseBackend),
    // DndModule.provideBackend(TouchBackend({delayTouchStart: 100})),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
