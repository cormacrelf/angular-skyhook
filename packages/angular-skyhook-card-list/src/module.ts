import { NgModule, ModuleWithProviders } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { CardTemplateDirective } from "./card-template.directive";
import { CardRendererDirective } from "./card-renderer.directive";
import { CommonModule } from "@angular/common";
import { SkyhookDndModule } from "angular-skyhook";
import { NgLetDirective } from "./ngLet.directive";
import { MutateDirective } from "./MutateDirective";
import { SimpleSortableDirective } from "./SimpleDirective";
import { SharedSortableService } from "./SharedSortableService";
import { DragulaDirective } from "./SimpleDirective";

@NgModule({
    declarations: [
        CardListComponent,
        CardTemplateDirective,
        CardRendererDirective,
        NgLetDirective,
        MutateDirective,
        SimpleSortableDirective,
        DragulaDirective
    ],
    exports: [
        CardListComponent,
        CardTemplateDirective,
        CardRendererDirective,
        MutateDirective,
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
