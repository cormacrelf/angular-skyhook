import { default as HTML5Backend } from "react-dnd-html5-backend";
import { default as TouchBackend } from "react-dnd-touch-backend";
import {
    default as MultiBackend,
    MouseTransition,
    TouchTransition,
    BackendTransition
} from "dnd-multi-backend";
import { BackendFactory } from 'dnd-core';

export const HTML5ToTouch = {
    backends: [
        {
            backend: HTML5Backend,
            transition: MouseTransition
        },
        {
            backend: TouchBackend,
            options: {
                enableMouseEvents: false,
            },
            preview: true,
            transition: TouchTransition
        }
    ] as BackendTransition[]
};

/**
 * DEPRECATED / @deprecated
 *
 * Prefer providing HTML5ToTouch directly as `options` to `forRoot`.
 *
 * ```typescript
 * import { MultiBackend, HTML5ToTouch } from '@angular-skyhook/multi-backend';
 *
 * imports: [
 *     ...,
 *     SkyhookDndModule.forRoot({ backend: MultiBackend, options: HTML5ToTouch }),
 * ]
 * ```
 * */
export function createDefaultMultiBackend(): BackendFactory {
    return (manager, ctx) => MultiBackend(manager, ctx, HTML5ToTouch);
}
