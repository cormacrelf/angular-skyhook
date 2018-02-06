import { Component, OnInit, Injectable, Input, ChangeDetectionStrategy } from '@angular/core';
import { TreeService } from './tree.service';

@Component({
  selector: 'drilldown-container',
  template: `
    <div>
      <drilldown-folder [keys]="[]"></drilldown-folder>
    </div>

    <drilldown-source (beginDrag)="beginDrag()" (endDrag)="endDrag()"></drilldown-source>

    <div *ngIf="lastDrop$|async as keys">
      <p>Last dropped on <code> {{keys.join(' > ')}} </code></p>
    </div>
  `,
  styles: [`
  `]
})
export class Container {
  lastDrop$ = this.tree.select(s => s.lastDrop);
  constructor(private tree: TreeService) {}
  beginDrag() {
    this.tree.beginDrag();
  }
  endDrag() {
    this.tree.endDrag();
  }
}
