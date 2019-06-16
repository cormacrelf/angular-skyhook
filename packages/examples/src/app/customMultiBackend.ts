import { MouseTransition, MultiBackend } from '@angular-skyhook/multi-backend';
import { BackendTransition, TouchTransition } from 'dnd-multi-backend';
import { BackendFactory } from 'dnd-core';
import { default as HTML5Backend } from 'react-dnd-html5-backend';
import { default as TouchBackend } from 'react-dnd-touch-backend';

const backendTransitions: BackendTransition[] = [
    {
        backend: HTML5Backend,
        transition: MouseTransition,
    },
    {
        backend: TouchBackend({
            enableMouseEvents: false,
            ignoreContextMenu: true,
            delayTouchStart: 200, // milliseconds
        }) as BackendFactory,
        transition: TouchTransition,
        preview: true,
    }
];

export function customMultiBackend(): BackendFactory {
    return MultiBackend({ backends: backendTransitions });
}
