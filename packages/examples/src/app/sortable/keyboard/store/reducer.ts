import { DraggedItem, SortableEvents, SortableAction } from '@angular-skyhook/sortable';
import { List, Record } from 'immutable';
import { Blob } from './blob';
import * as faker from 'faker';

export enum ActionTypes {
    SORT = "[simple-ngrx] SORT",
    KB_SELECT = "[simple-ngrx] KB_SELECT",
    KB_LIFT   = "[simple-ngrx] KB_LIFT",
    KB_DROP   = "[simple-ngrx] KB_DROP",
    KB_UP     = "[simple-ngrx] KB_UP",
    KB_DOWN   = "[simple-ngrx] KB_DOWN",
}
export class SelectBlob {
    readonly type = ActionTypes.KB_SELECT;
    constructor (public id: number) { }
}
export class LiftSelected {
    readonly type = ActionTypes.KB_LIFT;
}
export class DropSelected {
    readonly type = ActionTypes.KB_DROP;
}
export class MoveSelectedUp {
    readonly type = ActionTypes.KB_UP;
}
export class MoveSelectedDown {
    readonly type = ActionTypes.KB_DOWN;
}
export type SortAction = SortableAction<ActionTypes.SORT, Blob>
export type Actions =
    | SortAction
    | SelectBlob
    | LiftSelected
    | DropSelected
    | MoveSelectedUp
    | MoveSelectedDown;

const fake = () => faker.fake("/home/mezcal/{{system.fileName}}")

export class State extends Record({
    list: List(Array.from(new Array(6), fake).map(Blob.create)),
    draggingList: null as List<Blob>,
    flying: null as DraggedItem<Blob>,
    kbSelected: 0,
    kbLifted: false
}) {}

function sortReducer(state = new State(), action: SortAction) {
    const { index, hover, data } = action.item;
    switch (action.event) {
        case SortableEvents.BeginDrag: {
            return state
                .set('draggingList', state.list.remove(index))
                .set('flying', action.item)
                .set('kbSelected', action.item.data.id)
                .set('kbLifted', false);
        }
        case SortableEvents.Hover: {
            return state.set('flying', action.item);
        }
        case SortableEvents.Drop: {
            return state
                .set('list', state.draggingList.insert(hover.index, data))
                .delete('draggingList')
                .delete('flying')
                .set('kbSelected', action.item.data.id)
                .set('kbLifted', false);
        }
        case SortableEvents.EndDrag: {
            return state
                .delete('draggingList')
                .delete('flying')
                .set('kbSelected', action.item.data.id)
                .set('kbLifted', false);
        }
        default: return state;
    }
}

function getSelectedIndex(state: State) {
    return state.list.findIndex(x => x.id === state.kbSelected);
}

function keyboardMove(state: State, from: number, to: number) {
    to = Math.max(0, Math.min(state.list.count() - 1, to));
    if (!state.kbLifted) {
        // move selection up instead
        return state.set('kbSelected', state.list.get(to).id)
    }
    const blob = state.list.get(from);
    return state.update('list', list => {
        return list.remove(from).insert(to, blob);
    });
}

export function reducer(state = new State(), action: Actions) {
    switch (action.type) {
        case ActionTypes.SORT: {
            return sortReducer(state, action);
        }
        case ActionTypes.KB_SELECT: {
            return state.set('kbSelected', action.id);
        }
        case ActionTypes.KB_LIFT: {
            return state.set('kbLifted', !state.kbLifted);
        }
        case ActionTypes.KB_DROP: {
            return state.set('kbLifted', false);
        }
        case ActionTypes.KB_UP: {
            const index = getSelectedIndex(state);
            return keyboardMove(state, index, index - 1);
        }
        case ActionTypes.KB_DOWN: {
            const index = getSelectedIndex(state);
            return keyboardMove(state, index, index + 1);
        }
    }
    return state;
}
