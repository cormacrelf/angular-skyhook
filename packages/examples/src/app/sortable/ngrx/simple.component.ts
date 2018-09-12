import { Component, ChangeDetectionStrategy } from "@angular/core";
import { NgRxSortable } from "@angular-skyhook/sortable";
import { Store } from '@ngrx/store';
import { Blob } from './store/blob';
import { State, ActionTypes, SelectBlob } from './store/reducer';
import { _render } from './store/selectors';
import { HotkeysService, Hotkey, Hotkey } from 'angular2-hotkeys';

@Component({
    selector: 'rxsort-sortable',
    styleUrls: ['./simple.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <table ssSortable class="list" [ssSortableSpec]="rxSpec" #sortable="ssSortable">
        <thead>
            <tr><th>Hash</th><th>Filename</th></tr>
        </thead>
        <tbody>
            <tr *ngFor="let blob of sortable.children$|async; let i = index"
                [ssRender]="sortable.contextFor(blob, i)" #render="ssRender"
                [class.blob--placeholder]="render.isDragging$|async"
                [class.blob--selected]="blob.id === (selected$|async)"
                [dragSource]="render.source"
                (click)="click(blob)">

                <td class="hash"><code>{{ blob.hash }}</code></td>
                <td>{{ blob.content }}</td>
            </tr>
        </tbody>
    </table>
    `,
})
export class SimpleComponent {

    rxSpec = new NgRxSortable<Blob>(this.store, ActionTypes.SORT, {
        type: "BLOB",
        trackBy: x => x.id,
        getList: _ => this.store.select(_render),
    });

    selected$ = this.store.select(s => s.selected);

    constructor(private store: Store<State>, private hotkeys: HotkeysService) {
        this.hotkeys.add(new Hotkey('enter', (_event: KeyboardEvent): boolean => {
            console.log('enter pressed');
            return false; // Prevent bubbling
        }));
        this.hotkeys.add(new Hotkey('up', (_event: KeyboardEvent): boolean => {
            console.log('up pressed');
            return false; // Prevent bubbling
        }));
        this.hotkeys.add(new Hotkey('down', (_event: KeyboardEvent): boolean => {
            console.log('down pressed');
            return false; // Prevent bubbling
        }));
    }

    click(blob: Blob) {
        this.store.dispatch(new SelectBlob(blob.id));
    }

}
