import { SkyhookDndService, DropTarget } from "@angular-skyhook/core";
import { DraggedItem } from "./types";
import { Subject } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

export const SPILLED_LIST_ID: symbol = Symbol("SPILLED_LIST_ID");

export interface SpillConfiguration<Data> {
    drop?: (item: DraggedItem<Data>) => void;
    hover?: (item: DraggedItem<Data>) => void;
}

export const spillTarget = <Data>(
    dnd: SkyhookDndService,
    types: string|symbol|Array<string|symbol>|null,
    config: SpillConfiguration<Data>,
): DropTarget<DraggedItem<Data>> => {

    const mutate = (item: DraggedItem<Data>) =>  {
        item.hover = { listId: SPILLED_LIST_ID, index: 0 };
        return { ...item };
    }

    const hover$ = new Subject<DraggedItem<Data> | null>();

    const target = dnd.dropTarget<DraggedItem<Data>>(types, {
        hover: config.hover && (monitor => {
            if (monitor.canDrop() && monitor.isOver({ shallow: true })) {
                hover$.next(monitor.getItem());
            } else {
                hover$.next(null);
            }
        }),
        drop: config.drop && (monitor => {
            const item = monitor.getItem();
            if (config.drop && item && !monitor.didDrop()) {
                config.drop(mutate(item));
            }
        }) || undefined
    });

    const spilled$ = hover$
        .pipe(distinctUntilChanged(), filter(a => !!a));

    const subs = spilled$.subscribe((item) => {
        config.hover && item && config.hover(mutate(item));
    });

    target.add(subs);
    return target;
}
