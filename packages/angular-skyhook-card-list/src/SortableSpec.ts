import { DraggedItem } from "./dragged-item";
import { Data } from "./data";
import { Observable } from 'rxjs';

export interface SortableSpec<D extends Data = Data, Type = string|symbol> {
    trackBy: (data: D) => any;
    getList: (listId: any) => Observable<Iterable<D> | undefined>;
    canDrag?: (data: D, listId: any) => boolean;
    canDrop?: (item: DraggedItem<D, Type>) => boolean;
    beginDrag?: (item: DraggedItem<D, Type>) => void;
    hover?: (item: DraggedItem<D, Type>) => void;
    drop?: (item: DraggedItem<D, Type>) => void;
    endDrag?: (item: DraggedItem<D, Type>) => void;
    // copy?: (item: DraggedItem<T>) => T | boolean;
    // clone?: (data: T) => T;
}
