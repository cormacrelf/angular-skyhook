import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { SkyhookDndService } from 'angular-skyhook';
import { map } from 'rxjs/operators';

@Component({
    selector: 'skyhook-preview-renderer',
    template: `
    <div class="firefox-bug" [ngStyle]="style$|async">
        <ng-content></ng-content>
    </div>
    `,
    styles: [`
    :host {
      display: block;
      position: fixed;
      pointer-events: none;
      z-index: 100;
      left: 0;
      top: 0;
      width: 100%; height: 100%;
    }
    @keyframes animatedBorder {
      from { border-color: rgba(0,0,0,0); }
      to { border-color: rgba(0,0,0,1); }
    }
    .firefox-bug {
        animation-name: animatedBorder;
        animation-duration: 1.0s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyhookPreviewRendererComponent {

    layer = this.skyhook.dragLayer();

    collect$ = this.layer.listen(monitor => ({
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
    }));


    style$ = this.collect$.pipe(map((c) => {
        const { initialOffset, currentOffset } = c;

        if (!initialOffset || !currentOffset) {
            return {
                display: 'none',
            };
        }

        let { x, y } = currentOffset;

        const transform = `translate(${x}px, ${y}px)`;
        return {
            transform,
            WebkitTransform: transform,
        };
    }));

    constructor(private skyhook: SkyhookDndService) { }

    ngOnDestroy() {
        this.layer.unsubscribe();
    }
}