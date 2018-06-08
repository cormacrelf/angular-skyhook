import { default as HTML5Backend } from 'react-dnd-html5-backend';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { default as MultiBackend, createTransition, HTML5DragTransition, TouchTransition, MouseTransition } from 'dnd-multi-backend';

export { HTML5Backend, TouchBackend };
export { MultiBackend, createTransition, TouchTransition }

export const HTML5ToTouch = {
    backends: [
        {
            backend: HTML5Backend,
            transition: MouseTransition,
        },
        {
            backend: TouchBackend({ enableMouseEvents: false }),
            preview: true,
            transition: TouchTransition,
        }
    ],
};

export function createDefaultMultiBackend() {
    return MultiBackend(HTML5ToTouch);
}
