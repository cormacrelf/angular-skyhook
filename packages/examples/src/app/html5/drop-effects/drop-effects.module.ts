import { NgModule } from "@angular/core";
import { SkyhookDndModule } from "angular-skyhook";
import { CommonModule } from "@angular/common";
import { UtilityModule } from "../../utility.module";
import { RouterModule } from "@angular/router";
import { ContainerComponent } from "./container.component";
import { CopyTargetComponent } from "./copy-target.component";
import { BoxComponent } from "./box.component";

@NgModule({
    declarations: [
        ContainerComponent,
        CopyTargetComponent,
        BoxComponent
    ],
    imports: [
        CommonModule,
        SkyhookDndModule,
        UtilityModule,
        RouterModule.forChild([ { path: '', component: ContainerComponent } ])
    ]
})
export class DropEffectsModule {}