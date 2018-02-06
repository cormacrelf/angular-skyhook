import { SkyhookDndService, DropTargetSpec } from "angular-skyhook";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { race } from 'rxjs/observable/race';
import { empty } from "rxjs/observable/empty";
import { never } from "rxjs/observable/never";
import { distinctUntilChanged, filter, switchMapTo, delay, takeUntil, take } from "rxjs/operators";
import { tap } from "rxjs/operators/tap";

type Types = string | symbol | (string|symbol)[]

export class ActivatedWith {
    constructor(
        public type: string|symbol,
        public item: any,
    ) {}
}

export type ActivatorSpec = DropTargetSpec & { onActivate: (a: ActivatedWith) => void };

export const activatorDropTarget = (dnd: SkyhookDndService, types: Types, waitMillis: number, spec: ActivatorSpec) => {

    const dt = dnd.dropTarget(types, {
        ...spec as DropTargetSpec,
        hover: monitor => {
            hoverSubject$.next(new ActivatedWith(monitor.getItemType(), monitor.getItem()));
            spec.hover && spec.hover(monitor);
        }
    });

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
                    delay(waitMillis),
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
