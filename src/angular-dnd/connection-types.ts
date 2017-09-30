import { DropTargetMonitor } from './target-monitor';
import { DragSourceMonitor } from './source-monitor';
import { DndTypeOrTypeArray } from './type-ish';
import { Observable } from 'rxjs/Observable';

export interface DragSourceOptions {
  dropEffect?: 'copy' | 'move' | 'link' | 'none';
}

interface previewOptionsBase {
  /** */
  captureDraggingState?: boolean;
}
export interface DragPreviewOptionsAnchor extends previewOptionsBase {
  /** */
  anchorX?: number;
  /** */
  anchorY?: number;
}
export interface DragPreviewOptionsOffset extends previewOptionsBase {
  /** */
  offsetX?: number;
  /** */
  offsetY?: number;
}
export type DragPreviewOptions = DragPreviewOptionsAnchor | DragPreviewOptionsOffset;

/** Connects a drop target to a DOM element */
export interface DropTargetConnector {
  dropTarget  ( nativeElement: any): void;
}

/** Connects a drag source to a DOM element, either as the source itself or as
 *  a drag preview */
export interface DragSourceConnector {
  dragSource  ( nativeElement: any, options?: DragSourceOptions): void
  dragPreview ( nativeElement: any, options?: DragPreviewOptions): void;
}

interface ConnectionBase<TMonitor> {
  collect<O>(mapTo: (monitor: TMonitor) => O): Observable<O>;
  destroy(): void;
  destroyOn(obs: Observable<any>): this;
}

interface Connection<TMonitor, TConnector> extends ConnectionBase<TMonitor> {
  connector(): TConnector;
}

/** Represents one drop target and its behaviour, that can listen to the state
 *  and connect to a DOM element */
export interface DropTargetConnection extends Connection<DropTargetMonitor, DropTargetConnector> {
  setTypes(type: DndTypeOrTypeArray): void;
}

/** Represents one drag source and its behaviour, that can listen to the state
 *  and connect to a DOM element (source or preview) */
export interface DragSourceConnection extends Connection<DragSourceMonitor, DragSourceConnector> {
  setType(type: string|symbol): void;
}

export interface DragLayerConnection extends ConnectionBase<any> {
}

