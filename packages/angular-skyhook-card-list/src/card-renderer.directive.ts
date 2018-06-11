import { Directive } from "@angular/core";
import { Data } from "./data";
import { DragSource } from "angular-skyhook";

export interface CardRendererContext {
    $implicit: Data;
    isDragging: boolean;
    source: DragSource;
}

@Directive({
    selector: "[cardRenderer]"
})
export class CardRendererDirective {}
