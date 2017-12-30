import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-knight',
    template: `<span>♘</span>`,
    styles: [`
    span {
        font-weight: 700;
        font-size: 54px;
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Knight {
}
