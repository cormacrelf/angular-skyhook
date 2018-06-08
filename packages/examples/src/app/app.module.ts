import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SkyhookDndModule, DRAG_DROP_BACKEND } from 'angular-skyhook';
import { DragDropManager } from 'dnd-core';

/* Note:
 * Angular in AOT mode isn't capable of doing plain `import XXX from 'package-xxx'` imports.
 * Most existing backends follow the convention of doing default exports only, so in Angular
 * you should use `import { default as XXX } from 'package-xxx'` to import them.
 */
// import { default as HTML5Backend } from 'react-dnd-html5-backend'
// import { default as TouchBackend } from 'react-dnd-touch-backend';

// some examples here

// import { default as MouseBackend } from 'react-dnd-mouse-backend';
// import { default as TouchBackend } from 'react-dnd-touch-backend';
// import { default as MultiBackend } from 'react-dnd-multi-backend';
// import { default as HTML5toTouch } from 'react-dnd-multi-backend/lib/HTML5toTouch';

import { PreloadAllModules } from '@angular/router';
// this is our own adaptation of dnd-multi-backend. will be published eventually
import { createDefaultMultiBackend } from './angular-skyhook-multi-backend';

let routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'bins' },
  { path: 'bins', pathMatch: 'full', loadChildren: './bins/index#Module' },
  { path: 'sortable', pathMatch: 'full', loadChildren: './sortable/index#Module' },
  { path: 'chessboard', pathMatch: 'full', loadChildren: './chessboard/index#Module' },
  { path: 'drag-layer/simple', pathMatch: 'full', loadChildren: './drag-layer/index#Module' },
  { path: 'drag-layer/xy-pad', pathMatch: 'full', loadChildren: './xy-pad/index#Module' },
  { path: 'touch', pathMatch: 'full', loadChildren: './touch/index#Module' },
  { path: 'drilldown', pathMatch: 'full', loadChildren: './drilldown/index#Module' },
  { path: 'nested/sources', pathMatch: 'full', loadChildren: './nested/sources/index#Module' },
  { path: 'nested/targets', pathMatch: 'full', loadChildren: './nested/targets/index#Module' },
  { path: 'customize/handles-previews', pathMatch: 'full', loadChildren: './customize/handles-previews/index#HandlesPreviewsModule' }
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true }),
    SkyhookDndModule.forRoot({ backendFactory: createDefaultMultiBackend }),
    // SkyhookDndModule.forRoot({ backend: TouchBackend }),
    // SkyhookDndModule.forRoot({ backend: MouseBackend }),
  ],
  providers: [
    // { provide: DRAG_DROP_BACKEND, useFactory: backendFactory },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
