// import no symbols to get typings but not execute the monkey-patching module loader
/// <reference path="src/ambient.d.ts" />

export {
    SkyhookDndModule,
    BackendInput,
    BackendFactoryInput,
} from "./src/dnd.module";

export { DragSourceMonitor } from "./src/source-monitor";
export { DropTargetMonitor } from "./src/target-monitor";
export { DragLayerMonitor } from "./src/layer-monitor";

// the source, target and preview types
export { DropTarget, DragSource, DragLayer } from "./src/connection-types";

export { DragSourceOptions, DragPreviewOptions } from "./src/connectors";

export { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER } from "./src/tokens";

// direct API
export { SkyhookDndService, AddSubscription } from "./src/connector.service";
export { DropTargetSpec } from "./src/drop-target-specification";
export { DragSourceSpec } from "./src/drag-source-specification";

export {
    DndDirective,
    DragSourceDirective,
    DropTargetDirective,
    DragPreviewDirective,
} from "./src/dnd.directive";

export { Offset } from "./src/type-ish";
