/**
 * @ignore
 */
/** a second comment */

import { MonitorBase } from '../monitor-base';

export interface InternalMonitor extends MonitorBase {
  isDragging(): boolean;
  subscribeToOffsetChange(f: Function): Function;
  subscribeToStateChange(f: Function): Function;

  canDragSource(sourceId: any): boolean;
  isDraggingSource(sourceId: any): boolean;

  canDropOnTarget(targetId: any): boolean;
  isOverTarget(targetId: any, options: any): boolean;
  getDropResult(): boolean;
  didDrop(): boolean;
}

