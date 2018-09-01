import { Directive } from "@angular/core";
import { RenderContext } from "./render.directive";

export interface TemplateContext<Data> {
    $implicit: RenderContext<Data>
}

@Directive({
    selector: '[ssTemplate]'
})
export class SkyhookSortableTemplate {
}
