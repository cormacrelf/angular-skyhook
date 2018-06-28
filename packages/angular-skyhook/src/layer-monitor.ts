import { MonitorBase } from './monitor-base';

/**
 * The monitor available inside {@link DragLayer#listen}.
 */
export interface DragLayerMonitor<Item = any> extends MonitorBase<Item> {
  /** `true` if there is a drag operation in progress, `false` otherwise. */
  isDragging(): boolean;
}

