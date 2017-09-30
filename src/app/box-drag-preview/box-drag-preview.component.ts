import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-box-drag-preview',
  template: `
  <div class="phresh" [class.yellow]="yellow" >
    <app-box [title]="title"> </app-box>
  </div>
  `,
  styles: [`
    :host { display: inline-block; }
    .phresh {
      transform: rotate(-10deg);
      background: white;
      overflow: hidden;
    }
    .yellow {
      background: yellow;
    }
  `]
})
export class BoxDragPreviewComponent implements OnInit {
  @Input() title;
  yellow = false;
  destroy$ = new Subject();

  ngOnInit() {
    Observable.timer(500, 1000).takeUntil(this.destroy$).subscribe(() => {
      this.yellow = !this.yellow;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
