import { MouseTransition } from '@angular-skyhook/multi-backend';
import { BackendTransition, TouchTransition } from 'dnd-multi-backend';
import { default as HTML5Backend } from 'react-dnd-html5-backend';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { TouchBackendOptions } from 'react-dnd-touch-backend/lib/interfaces';

const backends: BackendTransition[] = [
    {
        backend: HTML5Backend,
        transition: MouseTransition,
    },
    {
        backend: TouchBackend,
        options: {
            enableMouseEvents: false,
            ignoreContextMenu: true,
            delayTouchStart: 200, // milliseconds
        } as TouchBackendOptions,
        transition: TouchTransition,
        preview: true,
    }
];

export const CustomTransitions = { backends };
