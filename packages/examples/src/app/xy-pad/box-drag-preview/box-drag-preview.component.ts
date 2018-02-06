import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-box-drag-preview',
  template: `
  <div class="phresh">
    <app-box [compensate]="false" ></app-box>
  </div>
  `,
  styles: [`
    :host { display: inline-block; }
    @keyframes animatedBackground {
      from { background: rgba(64, 160, 150, 0.8); }
      to { background: rgba(64, 160, 150, 0.2); }
    }
    .phresh {
      /*transform: rotate(-10deg);*/
      overflow: auto;
      margin-left: -32px;
      margin-top: -32px;
      padding: 16px;
      border-radius: 32px;
      animation-name: animatedBackground;
      animation-duration: 1.5s;
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
