import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'app';
  firstKind = "PAPER"
  constructor() {
    // setTimeout(() => this.firstKind = "CARDBOARD", 2000)
  }
}
