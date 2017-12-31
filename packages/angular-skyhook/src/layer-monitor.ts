/**
  * @module 3-Monitoring-State
  */
/** a second comment*/

import { MonitorBase } from './monitor-base';

export interface DragLayerMonitor extends MonitorBase {
  /** `true` if there is a drag operation in progress, `false` otherwise. */
  isDragging(): boolean;
}

