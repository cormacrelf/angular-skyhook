import { NgModule } from "@angular/core";
import { ExampleLink } from "./example-link.component";
import { NgLetDirective } from "./utility/ngLet.directive";

const both = [ExampleLink, NgLetDirective];

@NgModule({
    declarations: both,
    exports: both
})
export class UtilityModule {}
