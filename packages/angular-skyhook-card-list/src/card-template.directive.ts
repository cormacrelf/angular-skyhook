import { Directive } from "@angular/core";
import { Data } from "./data";
import { SortableSpec } from "./SortableSpec";

export interface CardRendererInput {
    data: Data;
    type: string | symbol;
    index: number;
    horizontal: boolean;
    listId: number;
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
