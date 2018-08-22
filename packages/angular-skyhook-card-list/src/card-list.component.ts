import {
    Component,
    Input,
    TemplateRef,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    ContentChildren,
    QueryList,
    OnDestroy,
    OnChanges,
    AfterViewInit,
    AfterContentInit,
    ElementRef,
    SimpleChanges,
} from "@angular/core";
import { SkyhookDndService } from "angular-skyhook";
// @ts-ignore
import { Observable } from "rxjs";
import {
    CardTemplateDirective,
    CardTemplateContext
} from "./card-template.directive";
import { CardListDirective } from './card-list.directive';

@Component({
    selector: "skyhook-card-list",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <ng-container *ngFor="let card of children;
                          let i = index;
                          trackBy: trackById" >
        <ng-container *ngTemplateOutlet="template;
            context: {
                $implicit: contextFor(card, i)
            }">
        </ng-container>
    </ng-container>
    `,
    styles: [`
    :host {
        display: block;
    }
    `],
    // allow injecting CardListDirective and getting the component
    providers: [{
        provide: CardListDirective,
        useExisting: CardListComponent
    }]
})
export class CardListComponent<Data>
    extends CardListDirective<Data>
    implements OnDestroy, OnChanges, AfterContentInit, AfterViewInit
{
    @Input() template?: TemplateRef<CardTemplateContext<Data>>;

    @ContentChildren(CardTemplateDirective, {
        read: TemplateRef
    })
    set cardRendererTemplates(ql: QueryList<TemplateRef<CardTemplateContext<Data>>>) {
        if (ql.length > 0) {
            this.template = ql.first;
        }
    };

    constructor(
        dnd: SkyhookDndService,
        el: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
    ) {
        super(dnd, el, cdr);
    }

    /** @ignore */
    trackById = (_: number, data: Data) => {
        return this.spec && this.spec.trackBy(data);
    }

    /** @ignore */
    ngAfterContentInit() {
        if (!this.template) {
            throw new Error("You must provide a <ng-template cardTemplate> as a content child, or with [template]=\"myTemplateRef\"")
        }
    }

    // forwarding lifecycle events is required until Ivy renderer

    /** @ignore */
    ngOnInit() {
        super.ngOnInit();
    }

    /** @ignore */
    ngAfterViewInit() {
        super.ngAfterViewInit();
    }

    /** @ignore */
    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    /** @ignore */
    ngOnDestroy() {
        super.ngOnDestroy();
    }

}
