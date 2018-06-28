import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-example-link',
    template: `
    <p>
        <a [href]="link" target="_blank">
            <i class="fab fa-github"></i>
            View the source on GitHub
        </a>
    </p>
    `,
    styles: [
        `
        .fab { color: black; }
        p {
            margin-top: 0;
        }
        a {
            padding: 8px;
            display: inline-block;
            background: rgba(68, 72, 224, 0.14);
            background: #e5e2fa;
            background: #e2ecfa;
            text-decoration: none;
        }
        `
    ]
})
export class ExampleLink {
    @Input() path: string;
    get link() {
        return 'https://github.com/cormacrelf/angular-skyhook/tree/master/packages/examples/src/app/' + this.path;
    }
}
