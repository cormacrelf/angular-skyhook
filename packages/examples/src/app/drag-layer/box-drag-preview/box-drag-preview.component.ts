import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

@Component({
  selector: 'app-box-drag-preview',
  template: `
  <div class="phresh">
    <app-box [title]="title"></app-box>
  </div>
  `,
  styles: [`
    :host { display: inline-block; }
    @keyframes animatedBackground {
      from { background: yellow; }
      to { background: white; }
    }
    .phresh {
      background: white;
      transform: rotate(-10deg);
      overflow: hidden;
      animation-name: animatedBackground;
      animation-duration: 0.7s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-direction: alternate;
    }
  `]
})
export class BoxDragPreviewComponent implements OnInit {
  @Input() title;

  constructor() {}

  ngOnInit() {
  }

}
