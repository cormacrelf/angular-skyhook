/**
 *
 * [[include:Top-Level.md]]
 * @module 1-Top-Level
 * @preferred
 */
/** a second comment */

// import no symbols to get typings but not execute the monkey-patching module loader
import {} from 'zone.js';

export { SkyhookDndModule, BackendInput, BackendFactoryInput } from './dnd.module';

export { DragLayerMonitor } from './layer-monitor';

// the source, target and preview types
export {
  DropTarget,
  DragSource,
  DragLayer
} from './connection-types';

export {
  DropTargetConnector, DragSourceConnector, DragSourceOptions, DragPreviewOptions
} from './connectors';

export { DRAG_DROP_BACKEND, DRAG_DROP_MANAGER } from './tokens';

// direct API
export { SkyhookDndService } from './connector.service';
export { DropTargetSpec } from './drop-target-spec';
export { DragSourceSpec } from './drag-source-spec';

export { DragSourceDirective, DropTargetDirective, DragPreviewDirective } from './dnd.directive';

