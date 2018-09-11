import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ItemTypes } from './itemTypes';
import { TreeService } from './tree.service';
import { SkyhookDndService } from "@angular-skyhook/core";
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { activatorDropTarget } from './activatorDropTarget';

@Component({
  selector: 'drilldown-folder',
  template: `
  <ng-container *ngIf="keys.length === 0 else node">
    <ul [class.has-children]="anyChildren$|async">
      <drilldown-folder
          *ngFor="let c of children$|async; trackBy: tracker"
          [keys]="keys.concat([c])">
      </drilldown-folder>
    </ul>
  </ng-container>
  <ng-template #node>
    <li [class.root]="keys.length === 0" 
      [class.is-open]="isOpen$|async"
      [class.is-over]="isOver$|async"
      [class.has-children]="anyChildren$|async" >

      <div [dropTarget]="target" (click)="toggle()" >
        <b *ngIf="anyChildren$|async; else leaf">{{ ownKey }} ...</b>
        <ng-template #leaf>
            {{ ownKey }}
        </ng-template>
      </div>

      <ul [class.root]="keys.length === 0" *ngIf="(isOpen$|async)" [class.has-children]="anyChildren$|async">
        <drilldown-folder
            *ngFor="let c of children$|async; trackBy: tracker"
            [keys]="keys.concat([c])">
        </drilldown-folder>
      </ul>
    </li>
  </ng-template>
  `,

  styleUrls: ['./folder.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Folder {

  @Input() keys: string[];
  get ownKey() {
    if (this.keys.length === 0) {
      return '<root>';
    }
    return this.keys[this.keys.length-1];
  }

  children$: Observable<string[]>;
  anyChildren$: Observable<boolean>;
  isOpen$: Observable<boolean>

  // note, we are using a wrapped version of dnd.dropTarget.
  // this one will observe the 'hover' callback for us, and use Rx
  // to wait 600ms before firing onActivate, with appropriate cancellation
  // if you provide your own hover: () => callback, it will also be run.
  // the returned object is the same DropTargetConnection, which you should 
  // connect to the DOM, and then unsubscribe() from later.
  target = activatorDropTarget(this.dnd, ItemTypes.EMAIL, 600, {
    onActivate: a => {
      this.tree.openTransient(this.keys);
      // this.cdr.detectChanges();
    },
    drop: monitor => {
      this.tree.drop(this.keys);
    }
  });

  isOver$ = this.target.listen(m => m.isOver() && m.canDrop());

  constructor (public tree: TreeService, private dnd: SkyhookDndService, private ngZone: NgZone) { }

  ngOnInit() {
    //   console.log('ngOnInit', this.keys);
    this.children$ = this.tree.getChildren(this.keys);
    this.anyChildren$ = this.children$.pipe(
        map(cs => cs && cs.length > 0),
    );
    this.isOpen$ = this.tree.isOpen(this.keys);
  }

  tracker(_, c: string) { return c; }

  toggle() {
    this.tree.toggle(this.keys);
  }

  ngOnDestroy() {
    this.target.unsubscribe();
  }
}