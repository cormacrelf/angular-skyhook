import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-box',
  template: ` <div> {{ title }} </div> `,
  styles: [`
    div { border: 1px dashed grey;
          cursor: move;
          padding: 0.5rem 1rem; }
    `]
})
export class BoxComponent {
  @Input() title: string;
}
