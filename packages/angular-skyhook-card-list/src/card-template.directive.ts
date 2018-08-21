import { Directive } from "@angular/core";
import { CardRendererContext } from "./card-renderer.directive";

export interface CardTemplateContext<Data> {
    $implicit: CardRendererContext<Data>
}

@Directive({
    selector: "[cardTemplate]"
})
export class CardTemplateDirective {
}
