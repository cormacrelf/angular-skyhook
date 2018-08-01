import { Directive } from "@angular/core";
import { Data } from "./data";
import { DraggedItem } from "./dragged-item";
import { SortableSpec } from "./SortableSpec";

export interface CardRendererInput {
    item: DraggedItem;
    data: Data;
    type: string | symbol;
    index: number;
    order: number;
    horizontal: boolean;
    listId: number;
    isDragging: boolean;
    hidden: boolean;
    spec: SortableSpec;
}

export interface CardTemplateContext {
    $implicit: CardRendererInput
}

@Directive({
    selector: "[cardTemplate]"
})
export class CardTemplateDirective {
}
