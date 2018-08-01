import { NgModule } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { CardTemplateDirective } from "./card-template.directive";
import { CardRendererDirective } from "./card-renderer.directive";
import { CommonModule } from "@angular/common";
import { SkyhookDndModule } from "angular-skyhook";
import { NgLetDirective } from "./ngLet.directive";
import { MutateDirective } from "./MutateDirective";
import { SimpleSortableDirective } from "./SimpleDirective";

@NgModule({
    declarations: [
        CardListComponent,
        CardTemplateDirective,
        CardRendererDirective,
        NgLetDirective,
        MutateDirective,
        SimpleSortableDirective,
    ],
    exports: [
        CardListComponent,
        CardTemplateDirective,
        CardRendererDirective,
        MutateDirective,
        SimpleSortableDirective,
    ],
    imports: [CommonModule, SkyhookDndModule]
})
export class SkyhookCardListModule {}
