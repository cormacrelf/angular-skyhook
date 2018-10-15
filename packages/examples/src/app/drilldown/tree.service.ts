import { Injectable } from "@angular/core";
import { publishReplay, refCount, map, scan, startWith } from "rxjs/operators";
import { distinctUntilChanged } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

interface Node {
    [k: string]: Node
}

interface OpenSet {
    [k: string]: boolean
}

type Shape = {
    structure: Node,
    open: OpenSet,
    preDragOpen: OpenSet,
    lastDrop?: string[]
};

const BEGIN_DRAG = "BEGIN_DRAG";
const END_DRAG = "END_DRAG";
const OPEN_TRANSIENT = "OPEN_TRANSIENT";
const DROP = "DROP";
const TOGGLE = "TOGGLE";

class BeginDrag {
    readonly type = BEGIN_DRAG;
    constructor() {}
}
class EndDrag {
    readonly type = END_DRAG;
    constructor() {}
}
class OpenTransient {
    readonly type = OPEN_TRANSIENT;
    constructor(public keys: string[]) {}
}
class Drop {
    readonly type = DROP;
    constructor(public keys: string[]) {}
}
class Toggle {
    readonly type = TOGGLE;
    constructor(public keys: string[]) {}
}

type Actions = BeginDrag | EndDrag | OpenTransient | Drop | Toggle | { type: '@@init' };

const initialState: Shape = {
    structure: {
        Infraction: {
            Anecdotal: {
                Clumsily: {},
                Megalomaniac: {},
                Neurotic: {},
            },
            Basilica: {
                Salivate: {},
            },
            Candid: {
                Granada: {}
            }
        },
        Magnanimous: {
            'Jalapeño': {
                Poppers: {}
            },
            'Jalapeño2': {
                Poppers3: {}
            }
        },
        Byzantine: {
            'Fault': {
                Tolerance: {}
            },
            'Armadillo': {
                Farming: {}
            }
        }
    },
    open: {
        // nothing's open
        'Infraction': true,
        'Infraction.Basilica': true,
        'Infraction.Basilica.Salivate': true
    },
    preDragOpen: {
        // nothing's open
    }
}

@Injectable()
export class TreeService {

    private actions$ = new BehaviorSubject<Actions>({ type: '@@init' });

    private store$ = this.actions$.pipe(
        scan(TreeService.reducer, initialState),
        startWith(initialState),
        publishReplay(),
        refCount()
    );

    constructor() {
    }

    static makeKey(keys: string[]) {
        return keys.join(".")
    }

    static toggleSingle(set: OpenSet, keys: string[]): OpenSet {
        let key = TreeService.makeKey(keys);
        let neu = Object.assign({}, set, { [key]: !!!set[key] });
        return neu;
    }

    static openAllAncestors(set: OpenSet, keys: string[]): OpenSet {
        set = { ...set };
        for (let i = 0; i < keys.length; i++) {
            let key = TreeService.makeKey(keys.slice(0, i+1));
            set[key] = true;
        }
        return set
    }

    static reducer(state: Shape, action: Actions): Shape {
        switch (action.type) {
            case BEGIN_DRAG: {
                return { ...state, preDragOpen: state.open };
            }
            case END_DRAG: {
                return { ...state, open: state.preDragOpen };
            }
            case OPEN_TRANSIENT: {
                // based on pre-dragging state
                return { ...state, open: TreeService.openAllAncestors(state.preDragOpen, action.keys) }
            }
            case DROP: {
                // based on pre-dragging state
                return { ...state, lastDrop: action.keys }
            }
            case TOGGLE: {
                // this happens outside a drag operation.
                return { ...state, open: TreeService.toggleSingle(state.open, action.keys) }
            }
            default:
                return state;
        }
    }

    static recursiveGet(obj: Node, ks: string[]): Node {
        if (ks.length === 0) {
            return obj;
        }
        let first = ks[0];
        return TreeService.recursiveGet(obj[first], ks.slice(0).splice(1))
    }

    select<K>(f: (state: Shape) => K) {
        return this.store$.pipe(map(f), distinctUntilChanged())
    }

    isOpen(keys: string[]) {
        return this.select(s => keys == null || keys.length === 0 || s.open[TreeService.makeKey(keys)]);
    }

    getChildren(keys: string[]) {
        return this.select(s => s).pipe(
            // distinctUntilKeyChanged('structure'),
            map(s => {
                let thisNode = TreeService.recursiveGet(s.structure, keys)
                return Object.keys(thisNode).sort();
            })
        );
    }

    beginDrag() {
        this.actions$.next(new BeginDrag())
    }
    endDrag() {
        this.actions$.next(new EndDrag())
    }
    toggle(keys: string[]) {
        this.actions$.next(new Toggle(keys))
    }
    openTransient(keys: string[]) {
        this.actions$.next(new OpenTransient(keys))
    }
    drop(keys) {
        this.actions$.next(new Drop(keys));
    }

}
