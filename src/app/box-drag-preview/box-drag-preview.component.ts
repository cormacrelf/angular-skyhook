import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-box-drag-preview',
  template: `
  <div [class.phresh]="phresh" [class.yellow]="yellow" > <app-box [title]="title" ></app-box></div>
  `,
  styles: [`
    :host { display: inline-block; }
    .phresh {
      transition: background 0.4s linear;
      transform: rotate(-10deg);
      background: white;
    }
    .yellow {
      background: yellow;
      overflow: hidden;
    }
    `]
})
export class BoxDragPreviewComponent implements OnInit {

  constructor(private zone: NgZone) {}

  @Input() title;
  yellow = false;
  phresh = true;
  interv: any = null
  subscription: Subscription;

  ngOnInit() {
    this.subscription = Observable.timer(500, 1000).subscribe(() => {
      this.yellow = !this.yellow;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
