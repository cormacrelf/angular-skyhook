declare module "dnd-multi-backend" {
    import { Backend } from 'dnd-core';
    import { BackendFactory } from 'dnd-core';
    import { DragDropManager } from 'dnd-core';
    export module PreviewManager {
        export function register(preview: BackendWatcher): void;
        export function unregister(preview: BackendWatcher): void;
    }
    export interface BackendWatcher {
        backendChanged(backend: Backend): void;
    }
    export interface Transition {
        event: string;
        check: (event: Event) => boolean;
    }
    export type BackendTransition = {
        backend: BackendFactory;
        transition: Transition;
        options?: any;
        preview?: boolean;
        skipDispatchOnTransition?: boolean,
    };
    export module PreviewManager {
        export function register(preview: BackendWatcher): void;
        export function unregister(preview: BackendWatcher): void;
    }
    export interface BackendWatcher {
        backendChanged(backend: Backend): void;
    }
    export interface MultiBackendExt {
        previewEnabled(): boolean;
    }
    const MultiBackend: BackendFactory;
    export default MultiBackend;
    export const createTransition: (
        event: string,
        check: (event: Event) => boolean
    ) => Transition;
    export const HTML5DragTransition: Transition;
    export const TouchTransition: Transition;
    export const MouseTransition: Transition;
}

