import { Directive, TemplateRef } from "@angular/core";
import { Data } from "./data";
import { DragSource } from "angular-skyhook";
import { DraggedItem } from "./dragged-item";

export interface CardRendererInput {
    card: Data;
    type: string | symbol;
    index: number;
    order: number;
    horizontal: boolean;
    listId: number;
}

export interface CardTemplateContext {
    $implicit: CardRendererInput
}

@Directive({
    selector: "[cardTemplate]"
})
export class CardTemplateDirective {
}
