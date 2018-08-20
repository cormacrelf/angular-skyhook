import { NgModule, ModuleWithProviders } from "@angular/core";
import { CardListDirective } from "./card-list.directive";
import { CardListComponent } from "./card-list.component";
import { CardTemplateDirective } from "./card-template.directive";
import { CardRendererDirective } from "./card-renderer.directive";
import { CommonModule } from "@angular/common";
import { SkyhookDndModule } from "angular-skyhook";
import { SharedSortableService } from "./SharedSortableService";
import { SharedDirective } from "./shared.directive";

@NgModule({
    declarations: [
        CardListComponent,
        CardListDirective,
        CardTemplateDirective,
        CardRendererDirective,
        SharedDirective
    ],
    exports: [
        CardListComponent,
        CardListDirective,
        CardTemplateDirective,
        CardRendererDirective,
        SharedDirective
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
