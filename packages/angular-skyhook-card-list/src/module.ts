import { NgModule } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { CardTemplateDirective } from "./card-template.directive";
import { PlaceholderTemplateDirective } from "./card-placeholder.directive";
import { CardRendererDirective } from "./card-renderer.directive";
import { CommonModule } from "@angular/common";
import { SkyhookDndModule } from "angular-skyhook";
import { NgLetDirective } from "./ngLet.directive";
import { PlaceholderDirective } from "./placeholder.directive";

@NgModule({
    declarations: [
        CardListComponent,
        CardTemplateDirective,
        CardRendererDirective,
        PlaceholderTemplateDirective,
        PlaceholderDirective,
        NgLetDirective
    ],
    exports: [
        CardListComponent,
        CardTemplateDirective,
        CardRendererDirective,
        PlaceholderTemplateDirective,
        PlaceholderDirective,
    ],
    imports: [CommonModule, SkyhookDndModule]
})
export class SkyhookCardListModule {}
