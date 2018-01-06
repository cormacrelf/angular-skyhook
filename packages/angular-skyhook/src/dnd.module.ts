/**
 * [[include:Quickstart.md]]
 * @module 0-Quickstart
 */
/** a second comment */

import { NgModule, ModuleWithProviders, InjectionToken, NgZone } from '@angular/core';

import { SkyhookDndService } from './connector.service';
import { DragSourceDirective, DropTargetDirective, DragPreviewDirective } from './dnd.directive';

import { DRAG_DROP_BACKEND } from './tokens';

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
}

// TODO allow injecting window
/** @private */
export function managerFactory(backend: any, zone: NgZone, context = { 'window': window }) {
  backend = unpackBackendForEs5Users(backend);
  return zone.runOutsideAngular(() => new DragDropManager(backend, context));
}

export interface BackendInput {
  /** A plain backend, for example when using the HTML5Backend. */
  backend: any;
}

export interface BackendFactoryInput {
  /** Use this with the MultiBackend, with an
   *
   * ```
   * export function createBackend() {
   *     return MultiBackend(...);
   * }
   * // ...
   * SkyhookDndModule.forRoot({ backendFactory: createBackend })
   * ```
   *
   * You have to do this to retain AOT compatibility.
   */
  backendFactory: () => any;
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
export class SkyhookDndModule {
  static forRoot(backendOrBackendFactory: BackendInput | BackendFactoryInput): ModuleWithProviders {
    return {
      ngModule: SkyhookDndModule,
      providers: [
        {
          provide: DRAG_DROP_BACKEND,
          // whichever one they have provided, the other will be undefined
          useValue: (backendOrBackendFactory as BackendInput).backend,
          useFactory: (backendOrBackendFactory as BackendFactoryInput).backendFactory
        },
        {
          provide: DragDropManager,
          useFactory: managerFactory,
          deps: [ DRAG_DROP_BACKEND, NgZone ]
        },
        SkyhookDndService,
      ]
    };
  }

}
