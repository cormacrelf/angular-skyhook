import { DraggedItem, SortableEvents, SortableAction } from '@angular-skyhook/sortable';
import { List, Record } from 'immutable';
import { Blob } from './blob';
import * as faker from 'faker';

export enum ActionTypes {
    SORT = "[simple-ngrx] SORT",
    SELECT = "[simple-ngrx] SELECT",
}
export class SelectBlob {
    readonly type = ActionTypes.SELECT;
    constructor (public id: number) { }
}
export type SortAction = SortableAction<ActionTypes.SORT, Blob>
export type Actions = SortAction | SelectBlob;

const fake = () => faker.fake("/home/mezcal/{{system.fileName}}")

export class State extends Record({
    list: List(Array.from(new Array(6), fake).map(Blob.create)),
    draggingList: null as List<Blob>,
    flying: null as DraggedItem<Blob>,
    selected: -1
}) {}

function sortReducer(state = new State(), action: SortAction) {
    const { index, hover, data } = action.item;
    switch (action.event) {
        case SortableEvents.BeginDrag: {
            return state
                .set('draggingList', state.list.remove(index))
                .set('flying', action.item);
        }
        case SortableEvents.Hover: {
            return state.set('flying', action.item);
        }
        case SortableEvents.Drop: {
            return state
                .set('list', state.draggingList.insert(hover.index, data))
                .delete('draggingList')
                .delete('flying')
        }
        case SortableEvents.EndDrag: {
            return state.delete('draggingList').delete('flying');
        }
        default: return state;
    }
}

export function reducer(state = new State(), action: Actions) {
    switch (action.type) {
        case ActionTypes.SORT: {
            return sortReducer(state, action);
        }
        case ActionTypes.SELECT: {
            return state.set('selected', action.id);
        }
    }
    return state;
}
