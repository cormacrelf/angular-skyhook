import { NgModule, ModuleWithProviders, InjectionToken, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropManager } from 'dnd-core';
export { DragDropManager } from 'dnd-core';

export const DRAG_DROP_MANAGER = new InjectionToken("dnd-core manager");
export const DRAG_DROP_BACKEND = new InjectionToken("angular-dnd backend");

function invariant(assertion: boolean, msg: string) {
  if (!assertion) {
    throw new Error(msg);
  }
}

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
export function managerFactory(backend: any, zone: NgZone, context={'window': window}) {
  // support es5
  if (backend.default) {
    backend = backend.default;
  }
  return zone.runOutsideAngular(() => new DragDropManager(unpackBackendForEs5Users(backend), context))
}
