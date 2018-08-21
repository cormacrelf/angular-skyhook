import { SkyhookDndService, DropTarget } from "angular-skyhook";
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

    const spillTarget = dnd.dropTarget<DraggedItem<Data>>(types, {
        drop: monitor => {
            const item = monitor.getItem();
            if (config.drop && item && !monitor.didDrop()) {
                config.drop(mutate(item));
            }
        }
    });

    const spilled$ = spillTarget
        .listen(m => m.canDrop() && m.isOver({ shallow: true }))
        .pipe(filter(x => x));

    const item$ = spillTarget.listen(m => m.getItem());

    const subs = spilled$.pipe(withLatestFrom(item$)).subscribe(([_, item]) => {
        config.hover && item && config.hover(mutate(item));
    });

    spillTarget.add(subs);
    return spillTarget;
}

