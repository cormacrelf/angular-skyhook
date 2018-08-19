import { NgModule, ModuleWithProviders } from "@angular/core";
import { CardListDirective } from "./card-list.directive";
import { CardListComponent } from "./card-list.component";
import { CardTemplateDirective } from "./card-template.directive";
import { CardRendererDirective } from "./card-renderer.directive";
import { CommonModule } from "@angular/common";
import { SkyhookDndModule } from "angular-skyhook";
import { SimpleSortableDirective } from "./SimpleDirective";
import { SharedSortableService } from "./SharedSortableService";
import { DragulaDirective } from "./SimpleDirective";

@NgModule({
    declarations: [
        CardListComponent,
        CardListDirective,
        CardTemplateDirective,
        CardRendererDirective,
        SimpleSortableDirective,
        DragulaDirective
    ],
    exports: [
        CardListComponent,
        CardListDirective,
        CardTemplateDirective,
        CardRendererDirective,
        SimpleSortableDirective,
        DragulaDirective
    ],
    imports: [CommonModule, SkyhookDndModule]
})
export class SkyhookCardListModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SkyhookCardListModule,
            providers: [
                SharedSortableService
            ]
        }
    }
}
