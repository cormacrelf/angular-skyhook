import {
    Component,
    Input,
    TemplateRef,
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
import { Data } from "./types";
import {
    CardTemplateDirective,
    CardTemplateContext
} from "./card-template.directive";
import { CardListDirective } from './card-list.directive';

@Component({
    selector: "skyhook-card-list",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <ng-container *ngFor="let card of children$ | async;
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
        display: flex;
    }
    `]
})
export class CardListComponent
    extends CardListDirective
    implements OnDestroy, OnChanges, AfterContentInit, AfterViewInit
{
    @Input() template?: TemplateRef<CardTemplateContext>;

    @ContentChildren(CardTemplateDirective, {
        read: TemplateRef
    })
    set cardRendererTemplates(ql: QueryList<TemplateRef<CardTemplateContext>>) {
        if (ql.length > 0) {
            this.template = ql.first;
        }
    };

    constructor(
        dnd: SkyhookDndService,
        el: ElementRef<HTMLElement>,
    ) {
        super(dnd, el);
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
