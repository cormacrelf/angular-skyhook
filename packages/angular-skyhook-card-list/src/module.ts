import { NgModule } from "@angular/core";
import { CardListDirective } from "./card-list.directive";
import { CardListComponent } from "./card-list.component";
import { CardTemplateDirective } from "./card-template.directive";
import { CardRendererDirective } from "./card-renderer.directive";
import { CommonModule } from "@angular/common";
import { SkyhookDndModule } from "angular-skyhook";

const EXPORTS = [
    CardListComponent,
    CardListDirective,
    CardTemplateDirective,
    CardRendererDirective,
];

@NgModule({
    declarations: EXPORTS,
    exports: EXPORTS,
    imports: [CommonModule, SkyhookDndModule]
})
export class SkyhookCardListModule {
}
