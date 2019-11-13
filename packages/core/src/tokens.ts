/**
 * @module Misc
 */
/** */

import { DragDropManager, BackendFactory, Backend } from 'dnd-core';
import { InjectionToken } from '@angular/core';

/** The injection token for the dnd-core compatible backend currently in use. */
export const DRAG_DROP_BACKEND = new InjectionToken<Backend>(
    'dnd-core compatible backend'
);

/** The injection token for the dnd-core BackendFactory used to instantiate dnd-core. */
export const DRAG_DROP_BACKEND_FACTORY = new InjectionToken<BackendFactory>(
    'dnd-core compatible backend'
);

/** The injection token for the dnd-core compatible backend's options. */
export const DRAG_DROP_BACKEND_OPTIONS = new InjectionToken<any>(
    'options for dnd-core compatible backend'
);

/** The injection token for the dnd-core compatible backend currently in use. */
export const DRAG_DROP_BACKEND_DEBUG_MODE = new InjectionToken<any>(
    'should dnd-core run in debug mode?'
);

/** The injection token for the dnd-core DragDropManager */
export const DRAG_DROP_MANAGER = new InjectionToken<DragDropManager>(
    'dnd-core DragDropManager'
);

/** The injection token for the dnd-core compatible backend currently in use. */
export const DRAG_DROP_GLOBAL_CONTEXT = new InjectionToken<any>(
    'dnd-core context'
);

/** The type a source or target is given as a marker for 'you supplied null as a type',
 *  so that library consumers can be reminded to use setType/setTypes manually.
 *  See {@link DragSource#setType}, {@link DropTarget#setTypes}.
 */
export const TYPE_DYNAMIC: symbol = Symbol(
    'no type specified, you must provide one with setType/setTypes'
);
