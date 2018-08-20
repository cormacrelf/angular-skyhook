import { Injectable, OnDestroy } from '@angular/core';
import { DraggedItem, SortableSpec, Data } from './types';
// @ts-ignore
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

export interface ListsById<C> {
    [k: string]: C[];
}

interface OnlySupported<C extends Data> {
    trackBy: (data: C) => any;
    canDrag?: (data: C, listId: any) => boolean;
    canDrop?: (item: DraggedItem<C>) => boolean;
}

export interface GroupOptions<C extends Data> {
    trackBy: (data: C) => any;
    copy?: (item: DraggedItem<C>) => boolean;
    clone?: (data: C) => C;
    canDrag?: (data: C, listId: any) => boolean;
    canDrop?: (item: DraggedItem<C>) => boolean;
}

export class Group<C extends Data> {
    constructor(
        public type: string|symbol,
        public lists: ListsById<C> = {},
        public options: GroupOptions<C>,
        public spec: SortableSpec<C>
    ) {}
}

export interface Groups {
    [k: string]: Group<any> | undefined;
}

interface State {
    buckets: Groups;
    beforeDrag: Groups | null;
}

@Injectable()
export class SharedSortableService<C  extends Data = any> implements OnDestroy {

    private current: State = {
        buckets: {} as Groups,
        beforeDrag: null,
    };
    private buckets$ = new BehaviorSubject<State>(this.current);

    private subs = new Subscription();

    get either() {
        return this.current.beforeDrag || this.current.buckets;
    }

    constructor() {
        this.subs.add(
            this.buckets$.subscribe(s => {
                this.current = s;
            })
        );
    }

    register(type: string | symbol, options: GroupOptions<C> = { trackBy: (x: any) => x.id }) {
        let group = this.current.buckets[type as string];
        const lists = group && group.lists || {};
        let spec = this.makeSpec(type, options);
        group = new Group(type, lists, options, spec);
        this.buckets$.next({
            ...this.current,
            buckets: {
                ...this.current.buckets,
                [type]: group
            }
        });
    }

    moveChild(item: DraggedItem) {
        if (!this.current.beforeDrag) {
            this.buckets$.next({
                ...this.current,
                beforeDrag: this.current.buckets
            });
        }
        let neu: Groups = { ...this.either };
        let group = neu[item.type as string];
        if (!group) {
            throw new Error(
                "Cannot use shared sortable if no Group has has been registered for that type"
            );
        }
        const { hover } = item;

        if (!item.isCopy && group.lists[item.listId]) {
            let fromChildren = group.lists[item.listId].slice(0);
            fromChildren.splice(item.index, 1);
            group = {
                ...group,
                lists: {
                    ...group.lists,
                    [item.listId]: fromChildren
                }
            }
        }
        let toChildren = group.lists[hover.listId].slice(0);
        toChildren.splice(hover.index, 0, item.data);
        group = {
            ...group,
            lists: {
                ...group.lists,
                [hover.listId]: toChildren
            }
        }

        neu[item.type as string] = group;
        return neu;
    }

    public specFor(type: string | symbol) {
        return this.buckets$.pipe(
            map(bs => bs.buckets[type as string]),
            map(g => g && g.spec),
            filter(x => !!x),
            distinctUntilChanged()
        ) as Observable<SortableSpec>;
    }

    public listFor(type: string | symbol, id: any) {
        return this.buckets$.pipe(
            map(bs => bs.buckets[type as string]),
            map(g => g && g.lists[id]),
            distinctUntilChanged()
        );
    }

    public tryUpdateList(type: string|symbol, id: any, list: C[]) {
        if (this.current.beforeDrag) {
            return;
        }
        let group = this.current.buckets[type as string];
        if (!group) {
            throw new Error("group does not exist");
        }
        let lists = { ...group.lists, [id]: list };
        group = new Group(type, lists, group.options, group.spec);
        this.buckets$.next({
            ...this.current,
            buckets: {
                ...this.current.buckets,
                [type]: group
            }
        });
    }

    private makeSpec(type: string | symbol, options: GroupOptions<C>): SortableSpec<C> {
        return {
            ...options as OnlySupported<C>,
            getList: (listId: any) => {
                return this.listFor(type, listId);
            },
            beginDrag: () => {
                this.buckets$.next({
                    ...this.current,
                    beforeDrag: this.current.buckets,
                });
            },
            hover: (item: DraggedItem<C>) => {
                let buckets = this.moveChild(item);
                this.buckets$.next({
                    ...this.current,
                    buckets,
                });
            },
            drop: (item: DraggedItem<C>) => {
                let buckets = this.moveChild(item);
                this.buckets$.next({
                    ...this.current,
                    beforeDrag: null,
                    buckets,
                });
            },
            endDrag: () => {
                this.buckets$.next({
                    beforeDrag: null,
                    buckets: this.either
                });
            }
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
