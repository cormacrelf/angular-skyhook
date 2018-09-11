import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SkyhookPreviewComponent } from "./preview.component";
import { SkyhookPreviewRendererComponent } from "./preview-renderer.component";

/** @ignore */
const EXPORTS = [
    SkyhookPreviewComponent,
    SkyhookPreviewRendererComponent,
];

@NgModule({
    imports: [CommonModule],
    declarations: EXPORTS,
    exports: EXPORTS,
})
export class SkyhookMultiBackendModule {}
