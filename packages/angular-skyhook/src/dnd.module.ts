import {
    NgModule,
    ModuleWithProviders,
    NgZone
} from '@angular/core';

import { SkyhookDndService } from './connector.service';
import {
    DragSourceDirective,
    DropTargetDirective,
    DragPreviewDirective
} from './dnd.directive';

import { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER } from './tokens';

import {
    createDragDropManager,
    BackendFactory
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
export function managerFactory(
    backendFactory: BackendFactory,
    zone: NgZone,
    context = { window: window }
) {
    backendFactory = unpackBackendForEs5Users(backendFactory);
    return zone.runOutsideAngular(() =>
        createDragDropManager(backendFactory, context)
    );
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
}

/**
 * Use this for providing backends that need configuring before use to {@link SkyhookDndModule#forRoot}.
 *
 * For use with the MultiBackend:
 *
 * ```typescript
 * import { createDefaultMultiBackend } from 'angular-skyhook-multi-backend';
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
}

@NgModule({
    imports: [],
    declarations: [
        DragSourceDirective,
        DropTargetDirective,
        DragPreviewDirective
    ],
    providers: [],
    exports: [DragSourceDirective, DropTargetDirective, DragPreviewDirective]
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
                        .backendFactory
                },
                {
                    provide: DRAG_DROP_MANAGER,
                    useFactory: managerFactory,
                    deps: [DRAG_DROP_BACKEND, NgZone]
                },
                SkyhookDndService
            ]
        };
    }
}
