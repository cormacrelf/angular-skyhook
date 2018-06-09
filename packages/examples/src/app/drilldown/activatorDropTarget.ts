import { SkyhookDndService, DropTargetSpec, DropTarget, DragSource, DragSourceSpec } from "angular-skyhook";
import { Subject, Subscription, Observable } from "rxjs";
import { of, race, empty, never } from "rxjs";
import { distinctUntilChanged, filter, switchMapTo, delay, takeUntil, take, tap } from "rxjs/operators";

type Types = string | symbol | (string|symbol)[]

type DragSourceFactory<SpecAdditions extends {} = {}> =
    (types: string|symbol, spec: DragSourceSpec & SpecAdditions, subscription?: Subscription) => DragSource;
export type DragSourceDecorator<O extends {}, I extends {} = {}> =
    (fac: DragSourceFactory<I>) => DragSourceFactory<O>;

type DropTargetFactory<SpecAdditions extends {} = {}> =
    (types: Types, spec: DropTargetSpec & SpecAdditions, subscription?: Subscription) => DropTarget;
export type DropTargetDecorator<O extends {}, I extends {} = {}> = (fac: DropTargetFactory<I>) => DropTargetFactory<O>;


export interface ActivatorSpec {
    onActivate: (a: ActivatedWith) => void;
    waitMillis: number;
}

export class ActivatedWith {
    constructor(
        public type: string|symbol,
        public item: any,
    ) {}
}

export const activatorDropTarget: DropTargetDecorator<ActivatorSpec> =
    (dropTargetFactory) => (types, spec, subscription) => {
        const dt = dropTargetFactory(types, {
            ...spec as DropTargetSpec,
            hover: monitor => {
                hoverSubject$.next(new ActivatedWith(monitor.getItemType(), monitor.getItem()));
                spec.hover && spec.hover(monitor);
            }
        }, subscription);

        const startedHovering$ = dt
            .listen(m => m.isOver() && m.canDrop())
            .pipe(
                // just emit when it changes to not-isOver
                distinctUntilChanged(),
                filter(isOver => isOver),
            // tap(() => console.log('started (isOver)'))
        );

        const stoppedHovering$ = dt
            .listen(m => m.isOver())
            .pipe(
                // just emit when it changes to not-canDrop
                distinctUntilChanged(),
                filter(canDrop => canDrop === false),
            // tap(() => console.log('stoppedHovering (canDrop)'))
        );

        // hover events input stream
        const hoverSubject$ = new Subject<ActivatedWith>();
        const activations$: Observable<ActivatedWith> = startedHovering$.pipe(
            // tap(() => console.log('startedHovering -> switchMapTo(...)')),
            switchMapTo(
                hoverSubject$.pipe(
                    delay(spec.waitMillis),
                    takeUntil(stoppedHovering$),
                    take(1),
                )
            ),
        );

        // internal subscription should die when the connection is torn down
        let subsc = activations$.subscribe(spec.onActivate);
        dt.add(subsc);

        return dt;
    };
