import {
    Component,
    TemplateRef,
    ContentChild,
    Input,
    Inject,
    ChangeDetectionStrategy
} from "@angular/core";
import { SkyhookDndService, DRAG_DROP_MANAGER } from "@angular-skyhook/core";
import { DragDropManager, Backend } from "dnd-core";
// @ts-ignore
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { PreviewManager, BackendWatcher } from 'dnd-multi-backend';


interface MultiBackendExt {
    previewEnabled(): boolean;
}

export interface PreviewTemplateContext {
    /** same as type */
    $implicit: string | symbol;
    type: string | symbol;
    item: Object & any;
}

/**
 * If you pass an `<ng-template let-type let-item="item">` to `<skyhook-preview>` as a child,
 * then that template will be rendered so as to follow the mouse around while dragging.
 * What you put in that template is up to you, but in most cases this will be:
 *
```html
<skyhook-preview>
  <ng-template let-type let-item="item">
    <ng-content [ngSwitch]="type">
      <!-- one kind of preview per type, using *ngSwitchCase="'TYPE'" -->
      <div *ngSwitchCase="'TYPE'">{{ item | json }}</div>
    </ng-content>
  </ng-template>
</skyhook-preview>
```
 */
@Component({
    selector: "skyhook-preview",
    template: `
    <ng-container *ngIf="previewEnabled$ | async">
        <skyhook-preview-renderer *ngIf="collect$ | async as c">
            <ng-container *ngIf="c.isDragging" >
                <ng-container
                    *ngTemplateOutlet="content; context: { $implicit: c.itemType, type: c.itemType, item: c.item }">
                </ng-container>
            </ng-container>
        </skyhook-preview-renderer>
    </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyhookPreviewComponent implements BackendWatcher {
    /** Disables the check for whether the current MultiBackend wants the preview enabled */
    @Input() allBackends = false;

    /** @ignore */
    @ContentChild(TemplateRef, { static: false })
    content!: TemplateRef<PreviewTemplateContext>;

    /** @ignore */
    private layer = this.skyhook.dragLayer();

    /** @ignore */
    previewEnabled$ = new BehaviorSubject(false);

    // we don't need all the fast-moving props here, so this optimises change detection
    // on the projected template's inputs (i.e. the context).
    // the fast-moving stuff is contained in the preview renderer.
    // also, we include this.isPreviewEnabled() because in this component with OnPush,
    // a plain getter isn't checked more than once, and this forces it to be called on each event.
    /** @ignore */
    collect$ = this.layer.listen(monitor => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        isDragging: monitor.isDragging(),
    }));

    /** @ignore */
    warned = false;

    /** @ignore */
    constructor(
        private skyhook: SkyhookDndService,
        @Inject(DRAG_DROP_MANAGER) private manager: DragDropManager,
    ) {
        if (this.manager == null) {
            this.warn(
                "no drag and drop manager defined, are you sure you imported SkyhookDndModule?"
            );
        } else {
            PreviewManager.register(this);
        }
    }

    /** @ignore */
    ngOnInit() {
        // Have to do this after allBackends receives its value.
        this.backendChanged(this.manager.getBackend());
    }

    /** @ignore */
    backendChanged(backend: Backend) {
        this.previewEnabled$.next(this.isPreviewEnabled(backend));
    }

    /** @ignore */
    ngOnDestroy() {
        this.layer.unsubscribe();
        PreviewManager.unregister(this);
    }

    /** @ignore */
    warn(msg: string) {
        if (!this.warned) {
            console.warn(msg);
        }
        this.warned = true;
    }

    /** @ignore */
    isPreviewEnabled(backend: Backend & Partial<MultiBackendExt>) {
        if (this.allBackends) {
            return true;
        }
        if (backend == null) {
            this.warn(
                "no drag and drop backend defined, are you sure you imported SkyhookDndModule.forRoot(backend)?"
            );
            return false;
        }
        // for when you are not using dnd-multi-backend
        if (typeof backend.previewEnabled !== 'function') {
            return true;
        }
        return backend.previewEnabled();
    }
}
