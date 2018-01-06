import { default as HTML5Backend } from 'react-dnd-html5-backend';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { default as MultiBackend, createTransition, HTML5DragTransition, TouchTransition } from 'dnd-multi-backend';

export { HTML5Backend, TouchBackend };
export { MultiBackend, createTransition, TouchTransition /*, HTML5DragTransition (no-op) */ }

export const MouseTransition = createTransition('mousedown', (e: Event) => {
    return e.type
        && e.type.indexOf('touch') === -1
        && e.type.indexOf('mouse') !== -1;
});

export const HTML5ToTouch = {
    backends: [
        {
            backend: HTML5Backend,
        },
        {
            backend: TouchBackend({ enableMouseEvents: false }),
            preview: true,
            transition: TouchTransition,
        },
        {
            backend: HTML5Backend,
            transition: MouseTransition,
        },
    ],
};

export function createDefaultMultiBackend() {
    return MultiBackend(HTML5ToTouch);
}
