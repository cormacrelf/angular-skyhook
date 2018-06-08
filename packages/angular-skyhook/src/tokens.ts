/**
 * @module Misc
 */
/** */

import { InjectionToken } from '@angular/core';

export const DRAG_DROP_BACKEND = new InjectionToken<any>('dnd-core compatible backend');
export const DRAG_DROP_MANAGER = new InjectionToken<any>('dnd-core DragDropManager');
export const TYPE_DYNAMIC = Symbol('no type specified, you must provide one with setType/setTypes');
