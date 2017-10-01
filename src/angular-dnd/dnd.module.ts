import { NgModule, ModuleWithProviders, InjectionToken, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropManager } from 'dnd-core';

import { DRAG_DROP_MANAGER, DRAG_DROP_BACKEND, managerFactory, unpackBackendForEs5Users } from './manager';
import { DndService } from './connector.service';
import { DragSourceDirective, DropTargetDirective, DragPreviewDirective, NoPreviewDirective } from './dnd.directive';

const declPlusExports = [
    DragSourceDirective,
    DropTargetDirective,
    DragPreviewDirective,
    NoPreviewDirective,
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule
  ],
  declarations: [
    ...declPlusExports,
  ],
  providers: [ ],
  exports: [
    ...declPlusExports,
  ]
})
export class DndModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DndModule,
      providers: [
        { provide: DRAG_DROP_MANAGER, useFactory: managerFactory, deps: [ DRAG_DROP_BACKEND, NgZone ] },
        DndService,
      ]
    }
  }

  static provideBackend(backend) {
    return {
      provide: DRAG_DROP_BACKEND,
      useValue: backend
    };
  }
}
