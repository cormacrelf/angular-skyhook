// TODO: move this to another package, in the `dnd-multi-backend` monorepo.

/// <reference path="src/ambient.d.ts" />
export { default as TouchBackend } from "react-dnd-touch-backend";
export { default as HTML5Backend } from "react-dnd-html5-backend";
export {
    default as MultiBackend,
    createTransition,
    HTML5DragTransition,
    TouchTransition,
    MouseTransition
} from "dnd-multi-backend";

export { HTML5ToTouch, createDefaultMultiBackend } from "./src/HTML5ToTouch";
export { SkyhookMultiBackendModule } from "./src/module";
export { SkyhookPreviewComponent } from './src/preview.component';
