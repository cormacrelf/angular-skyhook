import { Directive } from "@angular/core";
import { Data } from "./data";
import { Size } from "./size";
import { DraggedItem } from "./dragged-item";

export interface PlaceholderInput {
    order: number;
    item: DraggedItem;
    size: Size;
}

export interface PlaceholderTemplateContext {
    $implicit: PlaceholderInput;
}

@Directive({
    selector: "[placeholderTemplate]"
})
export class PlaceholderTemplateDirective {}
