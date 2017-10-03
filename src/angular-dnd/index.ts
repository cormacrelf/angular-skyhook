/**
 *
 * [[include:Top-Level.md]]
 * @module 1-Top-Level
 * @preferred
 */
/** a second comment */

export { DndModule } from './dnd.module';
export { DRAG_DROP_BACKEND } from './internal/manager';

export { DragLayerMonitor } from './internal/internal-monitor';

// the source, target and preview types
export {
  DropTarget,
  DragSource,
  DragLayer
} from './connection-types';

export {
  DropTargetConnector, DragSourceConnector, DragSourceOptions, DragPreviewOptions
} from './connectors';

// direct API
export { DndService } from './connector.service';
export { DropTargetSpec } from './drop-target';
export { DragSourceSpec } from './drag-source';

