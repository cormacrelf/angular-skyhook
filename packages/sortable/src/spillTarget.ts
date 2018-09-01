import { SkyhookDndService, DropTarget } from "@skyhook/core";
import { DraggedItem } from "./types";
import { filter, withLatestFrom } from 'rxjs/operators';

export const SPILLED_LISTID: symbol = Symbol("SPILLED_LISTID");

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
        item.hover = { listId: SPILLED_LISTID, index: 0 };
        return { ...item };
    }

    const target = dnd.dropTarget<DraggedItem<Data>>(types, {
        drop: config.drop && (monitor => {
            const item = monitor.getItem();
            if (config.drop && item && !monitor.didDrop()) {
                config.drop(mutate(item));
            }
        }) || undefined
    });

    const spilled$ = target
        .listen(m => m.canDrop() && m.isOver({ shallow: true }))
        .pipe(filter(x => x));

    const item$ = target.listen(m => m.getItem());

    const subs = spilled$.pipe(withLatestFrom(item$)).subscribe(([_, item]) => {
        config.hover && item && config.hover(mutate(item));
    });

    target.add(subs);
    return target;
}

