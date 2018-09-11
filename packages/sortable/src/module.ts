import { NgModule } from "@angular/core";
import { SkyhookSortable } from "./directives/sortable.directive";
import { SkyhookSortableList } from "./directives/list.component";
import { SkyhookSortableTemplate } from "./directives/template.directive";
import { SkyhookSortableRenderer } from "./directives/render.directive";
import { SkyhookSortableExternal } from "./directives/external.directive";
import { CommonModule } from "@angular/common";
import { SkyhookDndModule } from "@angular-skyhook/core";

/** @ignore */
const EXPORTS = [
    SkyhookSortable,
    SkyhookSortableList,
    SkyhookSortableTemplate,
    SkyhookSortableRenderer,
    SkyhookSortableExternal,
];

@NgModule({
    declarations: EXPORTS,
    exports: EXPORTS,
    imports: [CommonModule, SkyhookDndModule]
})
export class SkyhookSortableModule {}
