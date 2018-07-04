import { DragSourceSpec, DragSource, DropTargetSpec, DropTarget, SkyhookDndService, DragSourceMonitor } from "angular-skyhook";

export type Types = string | symbol | (string|symbol)[]

export type DragSourceFactory<Item, DropResult extends {} = {}, SpecAdditions extends {} = {}> =
    (types: string|symbol, spec: DragSourceSpec<Item> & SpecAdditions) => DragSource<Item, DropResult>;

export type DragSourceDecorator<Item, DropResult = {}, O extends {} = {}, I extends {} = {}> =
    (fac: DragSourceFactory<Item, DropResult, I>) => DragSourceFactory<Item, DropResult, O>;

export type DropTargetFactory<SpecAdditions extends {} = {}> =
    (types: Types, spec: DropTargetSpec & SpecAdditions) => DropTarget;

export type DropTargetDecorator<O extends {}, I extends {} = {}> = (fac: DropTargetFactory<I>) => DropTargetFactory<O>;

export function extendDragSourceSpec<I extends {}, O extends {}, D={}>(
    spec: DragSourceSpec<I, D>,
    extendWith: DragSourceSpec<O, D>) {
    return {
        ...spec as DragSourceSpec<I>,
        beginDrag: monitor => {
            let ret = {};
            if (spec.beginDrag) {
                ret = spec.beginDrag(monitor);
            }
            if (extendWith.beginDrag) {
                ret = {
                    ...ret,
                    ...extendWith.beginDrag(monitor) as {}
                };
            }
            return ret as I & O;
        },
        isDragging: monitor => {
            let isd = true;
            if (spec.isDragging) {
                isd = isd && spec.isDragging(monitor);
            }
            if (extendWith.isDragging) {
                isd = isd && extendWith.isDragging(monitor);
            }
            return isd;
        },
        endDrag: monitor => {
            if (spec.endDrag) {
                spec.endDrag(monitor);
            }
            if (extendWith.endDrag) {
                extendWith.endDrag(monitor);
            }
        }
    } as DragSourceSpec<I & O, D>;
}

export function extendDropTargetSpec<I extends {}, D extends {} = {}, O extends {} = {}>(
    spec: DropTargetSpec<I, D>,
    extendWith: DropTargetSpec<I, O>) {
    return {
        ...spec,
        drop: monitor => {
            let ret = {};
            if (spec.drop) {
                const x = spec.drop(monitor);
                if (x) {
                    ret = x;
                }
            }
            if (extendWith.drop) {
                ret = {
                    ...ret,
                    ...(extendWith.drop(monitor) || {}) as {}
                };
            }
            return ret as D & O;
        },
        canDrop: monitor => {
            let isd = true;
            if (spec.canDrop) {
                isd = isd && spec.canDrop(monitor);
            }
            if (extendWith.canDrop) {
                isd = isd && extendWith.canDrop(monitor);
            }
            return isd;
        },
        hover: monitor => {
            if (spec.hover) {
                spec.hover(monitor);
            }
            if (extendWith.hover) {
                extendWith.hover(monitor);
            }
        }
    } as DropTargetSpec<I, D & O>;
}
