declare module "dnd-multi-backend" {
    import { Backend } from 'dnd-core';
    import { BackendFactory } from 'dnd-core';
    import { DragDropManager } from 'dnd-core';
    export interface Transition {
        event: string;
        check: (event: Event) => boolean;
    }
    export type BackendTransition = {
        backend: BackendFactory;
        transition: Transition;
        preview?: boolean;
    };
    const MultiBackend: (
        transition: { backends: BackendTransition[] }
    ) => BackendFactory;
    export default MultiBackend;
    export const createTransition: (
        event: string,
        check: (event: Event) => boolean
    ) => Transition;
    export const HTML5DragTransition: Transition;
    export const TouchTransition: Transition;
    export const MouseTransition: Transition;
}

declare module "react-dnd-touch-backend" {
    import { Backend, BackendFactory } from "dnd-core";
    export interface AngleRange {
        start: number, // degrees, moving clockwise with 0/360 = pointing left
        end: number, // degrees, moving clockwise with 0/360 = pointing left
    }
    export interface TouchBackendOptions {
        enableMouseEvents?: boolean;
        enableTouchEvents?: boolean,
        enableKeyboardEvents?: boolean,
        ignoreContextMenu?: boolean,
        delayTouchStart?: number, // ms
        delayMouseStart?: number, // ms
        touchSlop?: number, // px
        scrollAngleRanges?: AngleRange[] | undefined,
    }
    const TouchBackend: (options: TouchBackendOptions) => BackendFactory;
    export default TouchBackend;
}
