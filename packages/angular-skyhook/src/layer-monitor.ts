/**
  * @module 3-Monitoring-State
  */
/** a second comment*/

import { MonitorBase } from './monitor-base';

export interface DragLayerMonitor<Item = any> extends MonitorBase<Item> {
  /** `true` if there is a drag operation in progress, `false` otherwise. */
  isDragging(): boolean;
}

