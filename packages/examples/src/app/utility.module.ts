import { NgModule } from "@angular/core";
import { ExampleLink } from "./example-link.component";

const both = [
    ExampleLink
];

@NgModule({
    declarations: both,
    exports: both
})
export class UtilityModule {}