import { Directive } from "@angular/core";
import { Data } from "./data";
import { DragSource } from "angular-skyhook";
import { DraggedItem } from "./dragged-item";

export interface CardRendererContext {
    $implicit: Data;
    isDragging: boolean;
    source: DragSource<DraggedItem>;
}

@Directive({
    selector: "[cardRenderer]"
})
export class CardRendererDirective { }
