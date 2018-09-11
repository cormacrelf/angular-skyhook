import { Component, OnInit, Injectable, Input, ChangeDetectionStrategy } from '@angular/core';
import { TreeService } from './tree.service';

@Component({
  selector: 'drilldown-container',
  template: `
    <app-example-link path="drilldown"></app-example-link>
    <p>Hover over a folder to temporarily drill down. Click normally on a folder to open or close it.</p>
    <p>
      This example uses a wrapper around <code>SkyhookDndService#dropTarget</code>, that listens to dnd-core
      hover events and fires a callback when you have hovered long enough. This is a clean pattern for extending
      <code>@angular-skyhook/core</code> in a reusable way.
    </p>
    <p *ngLet="lastDrop$|async as keys">Last dropped on <code> {{ keys ? keys.join(' > ') : '(never)' }} </code></p>
    <p>
      <drilldown-source (beginDrag)="beginDrag()" (endDrag)="endDrag()"></drilldown-source>
    </p>
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
