/**
 * @module Misc
 */
/** */

import { DragDropManager, Backend } from 'dnd-core';
import { InjectionToken } from '@angular/core';

/** The injection token for the dnd-core compatible backend currently in use. */
export const DRAG_DROP_BACKEND = new InjectionToken<Backend>('dnd-core compatible backend');

/** The injection token for the dnd-core DragDropManager */
export const DRAG_DROP_MANAGER = new InjectionToken<DragDropManager<any>>('dnd-core DragDropManager');

/** The type a source or target is given as a marker for 'you supplied null as a type',
 *  so that library consumers can be reminded to use setType/setTypes manually.
 *  See @{link DragSource#setType}, @{link DropTarget#setTypes}.
 */
export const TYPE_DYNAMIC = Symbol('no type specified, you must provide one with setType/setTypes');
