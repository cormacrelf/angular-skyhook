import { NgModule } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { CardTemplateDirective } from "./card-template.directive";
import { CardRendererDirective } from "./card-renderer.directive";
import { CommonModule } from "@angular/common";
import { SkyhookDndModule } from "angular-skyhook";
import { NgLetDirective } from "./ngLet.directive";

@NgModule({
    declarations: [
        CardListComponent,
        CardTemplateDirective,
        CardRendererDirective,
        NgLetDirective
    ],
    exports: [
        CardListComponent,
        CardTemplateDirective,
        CardRendererDirective,
    ],
    imports: [CommonModule, SkyhookDndModule]
})
export class SkyhookCardListModule {}
