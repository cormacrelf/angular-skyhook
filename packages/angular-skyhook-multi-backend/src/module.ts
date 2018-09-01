import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SkyhookPreviewComponent } from "./preview.component";
import { SkyhookPreviewRendererComponent } from "./preview-renderer.component";

@NgModule({
    imports: [CommonModule],
    declarations: [SkyhookPreviewComponent, SkyhookPreviewRendererComponent],
    exports: [SkyhookPreviewComponent, SkyhookPreviewRendererComponent]
})
export class SkyhookMultiBackendModule {}
