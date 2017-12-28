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
    @keyframes animatedBackground {
      from { background: yellow; }
      to { background: white; }
    }
    .phresh {
      transform: rotate(-10deg);
      overflow: hidden;
      animation-name: animatedBackground;
      animation-duration: 0.7s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-direction: alternate;
    }
    .yellow {
      background: white;
    }
  `]
})
export class BoxDragPreviewComponent implements OnInit {
  @Input() title;
  yellow = false;

  constructor(private zone: NgZone) {}

  ngOnInit() {
  }

}
