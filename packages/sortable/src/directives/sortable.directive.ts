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
import { DropTarget, SkyhookDndService } from "@angular-skyhook/core";
import { SortableSpec, DraggedItem } from "../types";
import { RenderContext } from "./render.directive";
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
                if (monitor.getItemType() !== this.spec.type) {
                    return false;
                }
                const item = monitor.getItem();
                if (!item) { return false; }
                return this.getCanDrop(item);
            },
            drop: monitor => {
                const item = monitor.getItem();
                if (item && this.getCanDrop(item)) {
                    this.spec && this.spec.drop && this.spec.drop(item);
                }
                return {};
            },
            hover: monitor => {
                const item = monitor.getItem();
                if (isEmpty(this.children) && item) {
                    const canDrop = this.getCanDrop(item);
                    if (canDrop && monitor.isOver({ shallow: true })) {
                        this.callHover(item, {
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
            horizontal: this.horizontal
        };
    }

    /** @ignore */
    private getCanDrop(item: DraggedItem<Data>, _default = true) {
        if (this.spec && this.spec.canDrop) {
            return this.spec.canDrop(item);
        }
        return _default;
    }

    /** @ignore */
    private callHover(item: DraggedItem<Data>, newHover?: { listId: any; index: number; }) {
        if (newHover) {
            // mutate the object
            item.hover = newHover;
            // but also shallow clone so distinct from previous,
            // useful if you rely on that for ngrx
            item = { ...item };
        }
        this.spec && this.spec.hover && this.spec.hover(item);
    }

    /** @ignore */
    ngOnInit() {
        this.updateSubscription();
        this.target.setTypes(this.spec.type);
    }

    /** @ignore */
    ngOnChanges({spec, listId}: SimpleChanges) {
        if (listId) {
            this.updateSubscription();
        }
        if (spec) {
            this.updateSubscription();
        }
        this.target.setTypes(this.spec.type);
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
