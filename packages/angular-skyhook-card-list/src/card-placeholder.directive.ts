import { Directive } from "@angular/core";
import { Data } from "./data";
import { Size } from "./size";

export interface CardPlaceholderContext {
    $implicit: null;
    size: Size;
}

@Directive({
    selector: "[cardPlaceholder]"
})
export class CardPlaceholderDirective {}
