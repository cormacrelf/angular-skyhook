import { Component, OnInit, Injectable, Input, ChangeDetectionStrategy } from '@angular/core';
import { TreeService } from './tree.service';

@Component({
  selector: 'drilldown-container',
  template: `
    <app-example-link path="drilldown"></app-example-link>
    <p>Hover over a folder to temporarily drill down. Click normally on a folder to open or close it.</p>
    <p *ngIf="lastDrop$|async as keys">Last dropped on <code> {{keys.join(' > ')}} </code></p>
    <drilldown-source (beginDrag)="beginDrag()" (endDrag)="endDrag()"></drilldown-source>
    <drilldown-folder [keys]="[]"></drilldown-folder>
  `,
  styles: [`
  :host {
    display: block;
    min-height: 600px;
  }
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
