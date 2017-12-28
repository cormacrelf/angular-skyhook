/**
 * [[include:Quickstart.md]]
 * @module 0-Quickstart
 */
/** a second comment */

import { NgModule, ModuleWithProviders, InjectionToken, NgZone } from '@angular/core';

import { DndService } from './connector.service';
import { DragSourceDirective, DropTargetDirective, DragPreviewDirective } from './dnd.directive';

import { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER } from './tokens';

import { DragDropManager } from 'dnd-core';

import { invariant } from './internal/invariant';

/** @private */
export function unpackBackendForEs5Users(backendOrModule: any) {
  // Auto-detect ES6 default export for people still using ES5
  let backend = backendOrModule;
  if (typeof backend === 'object' && typeof backend.default === 'function') {
    backend = backend.default;
  }
  invariant(
    typeof backend === 'function',
    'Expected the backend to be a function or an ES6 module exporting a default function. ' +
    'Read more: http://react-dnd.github.io/react-dnd/docs-drag-drop-context.html',
  );
  return backend;
};

// TODO allow injecting window
/** @private */
export function managerFactory(backend: any, zone: NgZone, context={'window': window}) {
  // support es5
  if (backend.default) {
    backend = backend.default;
  }
  return zone.runOutsideAngular(() => new DragDropManager(unpackBackendForEs5Users(backend), context))
}

@NgModule({
  imports: [
  ],
  declarations: [
    DragSourceDirective,
    DropTargetDirective,
    DragPreviewDirective,
  ],
  providers: [ ],
  exports: [
    DragSourceDirective,
    DropTargetDirective,
    DragPreviewDirective,
  ]
})
export class DndModule {
  static forRoot(backend: any): ModuleWithProviders {
    return {
      ngModule: DndModule,
      providers: [
        { provide: DRAG_DROP_BACKEND, useValue: backend },
        { provide: DRAG_DROP_MANAGER, useFactory: managerFactory, deps: [ DRAG_DROP_BACKEND, NgZone ] },
        DndService,
      ]
    }
  }

}
