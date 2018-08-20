import { Directive } from "@angular/core";
import { CardRendererContext } from "./card-renderer.directive";

export interface CardTemplateContext {
    $implicit: CardRendererContext
}

@Directive({
    selector: "[cardTemplate]"
})
export class CardTemplateDirective {
}
