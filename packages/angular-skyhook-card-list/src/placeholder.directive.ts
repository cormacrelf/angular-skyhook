import { Directive, HostBinding, Input } from '@angular/core';
import { PlaceholderInput } from './card-placeholder.directive';

@Directive({
    selector: '[cardPlaceholder]',
    exportAs: 'cardPlaceholder'
})
export class PlaceholderDirective {
    @Input('cardPlaceholder') context: PlaceholderInput;
    @HostBinding('style.order')
    get order() { return this.context.order; }
    @HostBinding('style.height')
    get height() { return this.context.size.style().height; }
    @HostBinding('style.width')
    get width() { return this.context.size.style().width; }
}
