import { NgModule } from "@angular/core";
import { CardListComponent } from "./card-list.component";
import { CardRendererDirective } from "./card-renderer.directive";
import { CardPlaceholderDirective } from "./card-placeholder.directive";
import { CardRendererComponent } from "./card-renderer.component";
import { CommonModule } from "@angular/common";
import { SkyhookDndModule } from "angular-skyhook";
import { NgLetDirective } from "./ngLet.directive";

@NgModule({
    declarations: [
        CardListComponent,
        CardRendererDirective,
        CardPlaceholderDirective,
        CardRendererComponent,
        NgLetDirective
    ],
    exports: [
        CardListComponent,
        CardRendererDirective,
        CardPlaceholderDirective
    ],
    imports: [CommonModule, SkyhookDndModule]
})
export class SkyhookCardListModule {}
