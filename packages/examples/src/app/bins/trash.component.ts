import { Input, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { SkyhookDndService, DragPreviewOptions, DragSourceSpec } from "@angular-skyhook/core";
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-trash',
  template: `
    <div class="trash pad" [class.empty]="empty" [class.in-flight]="inFlight">
      <span class="type">{{ type }}</span>
    </div>
  `,
  styles: [`
    .trash { background: #ffccff; }
    .empty { background: #eee; }
    .empty .type { visibility: hidden; }
    /* when preview is shown on mobile */
    .in-flight {
      width: 100px;
      background-clip: padding-box;
      border: 2px solid rgba(0,0,0,0.1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Trash {
  @Input() type: string;
  @Input() empty = false;
  @Input() inFlight = false;
}
