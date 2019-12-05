import {
    NgModule,
    ModuleWithProviders,
    NgZone
} from '@angular/core';

import { SkyhookDndService } from './connector.service';
import {
    DndDirective,
    DragSourceDirective,
    DropTargetDirective,
    DragPreviewDirective
} from './dnd.directive';

import { DRAG_DROP_BACKEND, DRAG_DROP_BACKEND_OPTIONS, DRAG_DROP_BACKEND_DEBUG_MODE, DRAG_DROP_MANAGER, DRAG_DROP_GLOBAL_CONTEXT } from './tokens';

import {
    createDragDropManager,
    BackendFactory,
    DragDropManager
} from 'dnd-core';

import { invariant } from './internal/invariant';

/** @ignore */
export function unpackBackendForEs5Users(backendOrModule: any) {
    // Auto-detect ES6 default export for people still using ES5
    let backend = backendOrModule;
    if (typeof backend === 'object' && typeof backend.default === 'function') {
        backend = backend.default;
    }
    invariant(
        typeof backend === 'function',
        'Expected the backend to be a function or an ES6 module exporting a default function. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-drop-context.html'
    );
    return backend;
}

// TODO allow injecting window
/** @ignore */
// @dynamic
export function managerFactory(
    backendFactory: BackendFactory,
    zone: NgZone,
    context: any,
    backendOptions?: any,
    debugMode?: boolean,
): DragDropManager {
    backendFactory = unpackBackendForEs5Users(backendFactory);
    return zone.runOutsideAngular(() =>
        createDragDropManager(backendFactory, context, backendOptions, debugMode)
    );
}

/** @ignore */
declare var global: any;
/** @ignore */
export function getGlobalContext(): any {
    return typeof global !== 'undefined' ? global : (window as any);
}

/*
 * Hold on, this gets a little confusing.
 *
 * A dnd-core Backend has lots of useful methods for registering elements and firing events.
 * However, backends are not distributed this way.
 * The HTML5Backend and the TestBackend, when imported { default as HTML5Backend }, are not Backends, they are
 * functions: (manager: DragDropManager) => Backend.
 * This is now known as a BackendFactory under dnd-core 4+ typescript annotations.
 *
 * However, Angular has its own conception of what a factory is for AOT. This is the 'factory'
 * to which BackendFactoryInput refers below.
 * Sometimes, users will want to preconfigure a backend (like TouchBackend, or MultiBackend).
 * For this, they need to export a function that returns a configured BackendFactory
 * and pass it in as  { backendFactory: exportedFunction }.
 */

/** Use this for providing plain backends to {@link SkyhookDndModule#forRoot}. */
export interface BackendInput {
    /** A plain backend, for example the HTML5Backend. */
    backend: BackendFactory;
    options?: any;
    debug?: boolean,
}

/**
 * Use this for providing backends that need configuring before use to {@link SkyhookDndModule#forRoot}.
 *
 * For use with the MultiBackend:
 *
 * ```typescript
 * import { createDefaultMultiBackend } from '@angular-skyhook/multi-backend';
 * // ...
 * SkyhookDndModule.forRoot({ backendFactory: createDefaultMultiBackend })
 * ```
 *
 * or with the TouchBackend by itself:
 *
 * ```typescript
 * export function createTouchBackend() {
 *     return TouchBackend({ enableMouseEvents: false });
 * }
 * // ...
 * SkyhookDndModule.forRoot({ backendFactory: createTouchBackend })
 * ```
 *
 * You have to do this to retain AOT compatibility.
 */
export interface BackendFactoryInput {
    /** See above. */
    backendFactory: () => BackendFactory;
    debug?: boolean;
}

/** @ignore */
const EXPORTS = [
    DndDirective,
    DragSourceDirective,
    DropTargetDirective,
    DragPreviewDirective,
];

// @dynamic
@NgModule({
    declarations: EXPORTS,
    exports: EXPORTS,
})
export class SkyhookDndModule {
    static forRoot(
        backendOrBackendFactory: BackendInput | BackendFactoryInput
    ): ModuleWithProviders {
        return {
            ngModule: SkyhookDndModule,
            providers: [
                {
                    provide: DRAG_DROP_BACKEND,
                    // whichever one they have provided, the other will be undefined
                    useValue: (backendOrBackendFactory as BackendInput).backend,
                    useFactory: (backendOrBackendFactory as BackendFactoryInput)
                        .backendFactory,
                },
                {
                    provide: DRAG_DROP_BACKEND_OPTIONS,
                    // whichever one they have provided, the other will be undefined
                    useValue: (backendOrBackendFactory as BackendInput).options,
                },
                {
                    provide: DRAG_DROP_BACKEND_DEBUG_MODE,
                    // whichever one they have provided, the other will be undefined
                    useValue: backendOrBackendFactory.debug,
                },
                {
                    provide: DRAG_DROP_GLOBAL_CONTEXT,
                    useFactory: getGlobalContext,
                },
                {
                    provide: DRAG_DROP_MANAGER,
                    useFactory: managerFactory,
                    deps: [
                        DRAG_DROP_BACKEND,
                        NgZone,
                        DRAG_DROP_GLOBAL_CONTEXT,
                        DRAG_DROP_BACKEND_OPTIONS,
                        DRAG_DROP_BACKEND_DEBUG_MODE,
                    ],
                },
                SkyhookDndService,
            ]
        };
    }
}
