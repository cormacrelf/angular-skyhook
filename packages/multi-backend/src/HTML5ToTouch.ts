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
            backend: TouchBackend({ enableMouseEvents: false }),
            preview: true,
            transition: TouchTransition
        }
    ] as BackendTransition[]
};

export function createDefaultMultiBackend(): BackendFactory {
    return MultiBackend(HTML5ToTouch);
}
