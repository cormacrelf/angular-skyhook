/**
 * @module Misc
 */
/** */

import { InjectionToken } from '@angular/core';

export const DRAG_DROP_BACKEND = new InjectionToken<any>('dnd-core compatible backend');
export const TYPE_DYNAMIC = Symbol('no type specified, you must provide one with setType/setTypes');
