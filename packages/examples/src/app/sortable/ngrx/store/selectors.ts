import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Blob } from './blob';
import { State } from './reducer';
import { hasher } from './hasher';
import { List } from 'immutable';

export const _state = createFeatureSelector<State>('simple-ngrx');
export const _render = createSelector(
    _state,
    (state) => {
        const { flying } = state;
        let either = state.draggingList || state.list;
        if (flying != null) {
            const { hover, data } = flying;
            return either.insert(hover.index, data);
        }
        return either;
    }
);

export const _list = createSelector(_state, s => s.list);
const summarize = (bs: List<Blob>) => hasher(
    bs.map(b => ""+b.id+""+b.hash.toString()).toArray().join(" ")
);

export const _unstableHash = createSelector(_render, summarize);
export const _overallHash = createSelector(_list, summarize);

export const _selected = createSelector(_state, s => s.kbSelected);
export const _lifted = createSelector(_state, s => s.kbLifted ? s.kbSelected : -1);
