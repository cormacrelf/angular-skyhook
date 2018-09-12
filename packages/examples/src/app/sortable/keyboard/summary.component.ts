import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { _overallHash, _unstableHash } from './store/selectors';
import { State } from './store/reducer';

@Component({
    selector: 'rxsort-summary',
    template: `
    <p>
        Hash of the unstable list: <code>{{ unstable$ | async }}</code>
        <br/>
        Hash of the stable list: <code>{{ stable$ | async }}</code>
    </p>
    `,
    styles: [`
        p { margin-top: 0; }
    `]
})
export class SummaryComponent {
    unstable$ = this.store.select(_unstableHash);
    stable$ = this.store.select(_overallHash);
    constructor(private store: Store<State>) {}
}
