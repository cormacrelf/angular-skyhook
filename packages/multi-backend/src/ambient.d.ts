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

