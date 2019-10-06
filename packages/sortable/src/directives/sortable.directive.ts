import {
    Input,
    Directive,
    OnInit,
    OnChanges,
    OnDestroy,
    AfterViewInit,
    ElementRef,
    SimpleChanges,
    ChangeDetectorRef,
} from '@angular/core';
// @ts-ignore
import { Subscription, Observable, BehaviorSubject } from "rxjs";
import { DropTarget, SkyhookDndService, DropTargetMonitor } from "@angular-skyhook/core";
import { SortableSpec, DraggedItem, RenderContext, HoverTrigger } from "../types";
import { isEmpty } from '../isEmpty';

@Directive({
    selector: '[ssSortable]',
    exportAs: 'ssSortable'
})
export class SkyhookSortable<Data> implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    @Input('ssSortableListId') listId: any = Math.random().toString();
    @Input('ssSortableHorizontal') horizontal = false;
    @Input('ssSortableSpec') protected spec!: SortableSpec<Data>;
    @Input('ssSortableChildren') children?: Iterable<Data>;
    /** Possible values:
     *
     * - 'halfway' (default): triggers a reorder when you drag halfway over a neighbour
     * - 'fixed': triggers as soon as you move over a neighbouring element. Does not work with variable size elements. */
    @Input('ssSortableTrigger') hoverTrigger = HoverTrigger.halfway;

    /** @ignore */
    private childrenSubject$ = new BehaviorSubject<Iterable<Data>>([]);
    /**
     * A handy way to subscribe to spec.getList().
     */
    public children$: Observable<Iterable<Data>> = this.childrenSubject$;

    /** @ignore */
    subs = new Subscription();
    /** @ignore */
    listSubs = new Subscription();

    /** This DropTarget is attached to the whole list.
     *
     * You may monitor it for information like 'is an item hovering over this entire list somewhere?'
     */
    target: DropTarget<DraggedItem<Data>>;

    /** @ignore */
    constructor(
        protected dnd: SkyhookDndService,
        protected el: ElementRef<HTMLElement>,
        protected cdr: ChangeDetectorRef,
    ) {
        this.target = this.dnd.dropTarget<DraggedItem<Data>>(null, {
            canDrop: monitor => {
                if (!this.acceptsType(monitor.getItemType())) {
                    return false;
                }
                const item = monitor.getItem();
                if (!item) { return false; }
                return this.getCanDrop(item, monitor);
            },
            drop: monitor => {
                const item = monitor.getItem();
                if (item && this.getCanDrop(item, monitor)) {
                    this.spec && this.spec.drop && this.spec.drop(item, monitor);
                }
                return {};
            },
            hover: monitor => {
                const item = monitor.getItem();
                if (this.children && isEmpty(this.children) && item) {
                    const canDrop = this.getCanDrop(item, monitor);
                    if (canDrop && monitor.isOver({ shallow: true })) {
                        this.callHover(item, monitor, {
                            listId: this.listId,
                            index: 0,
                        });
                    }
                }
            }
        }, this.subs);
    }

    /** @ignore */
    private updateSubscription() {
        const anyListId =
            (typeof this.listId !== 'undefined') && (this.listId !== null);
        if (anyListId && this.spec) {
            if (this.listSubs) {
                this.subs.remove(this.listSubs);
                this.listSubs.unsubscribe();
            }

            if (this.spec.getList)  {
                const cs$ = this.spec.getList(this.listId);
                this.listSubs = cs$ && cs$.subscribe(l => {
                    if (l) {
                        this.childrenSubject$.next(l);
                        this.children = l;
                        this.cdr.markForCheck();
                    }
                });

                this.subs.add(this.listSubs);
            }
        }
    }

    public contextFor(data: Data, index: number): RenderContext<Data> {
        return {
            data,
            index,
            listId: this.listId,
            spec: this.spec,
            horizontal: this.horizontal,
            hoverTrigger: this.hoverTrigger,
        };
    }

    /** @ignore */
    private getCanDrop(item: DraggedItem<Data>, monitor: DropTargetMonitor<DraggedItem<Data>>, _default = true) {
        if (this.spec && this.spec.canDrop) {
            return this.spec.canDrop(item, monitor);
        }
        return _default;
    }

    /** @ignore */
    private callHover(item: DraggedItem<Data>, monitor: DropTargetMonitor<DraggedItem<Data>>, newHover?: { listId: any; index: number; }) {
        if (newHover) {
            // mutate the object
            item.hover = newHover;
            // but also shallow clone so distinct from previous,
            // useful if you rely on that for ngrx
            item = { ...item };
        }
        this.spec && this.spec.hover && this.spec.hover(item, monitor);
    }

    /** @ignore */
    ngOnInit() {
        this.updateSubscription();
        this.target.setTypes(this.getTargetType());
    }

    getTargetType() {
        if (Array.isArray(this.spec.accepts)) {
            return this.spec.accepts;
        } else {
            return this.spec.accepts || this.spec.type;
        }
    }

    acceptsType(ty: string | symbol | null) {
        if (ty == null) return false;
        if (Array.isArray(this.spec.accepts)) {
            const arr = this.spec.accepts as Array<string|symbol>;
            return arr.indexOf(ty) !== -1;
        } else {
            let acc =  this.getTargetType();
            return ty == acc;
        }
    }

    /** @ignore */
    ngOnChanges({spec, listId}: SimpleChanges) {
        if (listId) {
            this.updateSubscription();
        }
        if (spec) {
            this.updateSubscription();
        }
        this.target.setTypes(this.getTargetType());
    }

    /** @ignore */
    ngAfterViewInit() {
        if (this.el) {
            this.target.connectDropTarget(this.el.nativeElement);
        } else {
            throw new Error('ssSortable directive must have ElementRef');
        }
    }

    /** @ignore */
    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
