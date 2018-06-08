import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-example-link',
    template: `
    <p><a [href]="link">Example on GitHub</a></p>
    `
})
export class ExampleLink {
    @Input() path: string;
    get link() {
        return 'https://github.com/cormacrelf/angular-skyhook/tree/master/packages/examples/src/app/' + this.path;
    }
}
