import { DragSourceSpec, DragSource, DropTargetSpec, DropTarget } from "@angular-skyhook/core";

export type Types = string | symbol | (string|symbol)[]

export type DragSourceFactory<Item, DropResult extends {} = {}, SpecAdditions extends {} = {}> =
    (types: string|symbol, spec: DragSourceSpec<Item> & SpecAdditions) => DragSource<Item, DropResult>;

export type DragSourceDecorator<Item, DropResult = {}, O extends {} = {}, I extends {} = {}> =
    (fac: DragSourceFactory<Item, DropResult, I>) => DragSourceFactory<Item, DropResult, O>;

export type DropTargetFactory<SpecAdditions extends {} = {}> =
    (types: Types, spec: DropTargetSpec & SpecAdditions) => DropTarget;

export type DropTargetDecorator<O extends {}, I extends {} = {}> = (fac: DropTargetFactory<I>) => DropTargetFactory<O>;

