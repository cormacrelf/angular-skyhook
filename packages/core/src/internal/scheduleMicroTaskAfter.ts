import { Observable, TeardownLogic, Subscriber, Operator } from 'rxjs';

/**
 * @ignore
 * This is an RxJS operator to schedule a microtask just after all
 * the synchronous subscribers have been processed.
 * It's useful because we use `microTasks !== 0` to determine when we are finished
 * processing all the listeners and are ready for Angular to perform change detection.
 */

export function scheduleMicroTaskAfter<T>(zone: Zone, uTask?: () => void) {
    return (source: Observable<T>): Observable<T> => {
        return source.lift(new RunInZoneOperator(zone, uTask));
    };
}

/**
 * @ignore
 */
export class ZoneSubscriber<T> extends Subscriber<T> {
    constructor(destination: Subscriber<T>, private zone: Zone, private uTask: () => void = (() => {})) {
        super(destination);
    }
    protected _next(val: T) {
        this.destination.next && this.destination.next(val);
        this.zone.scheduleMicroTask('ZoneSubscriber', this.uTask);
    }
}

/**
 * @ignore
 */
export class RunInZoneOperator<T, R> implements Operator<T, R> {
    constructor(private zone: Zone, private uTask?: () => void) { }
    call(subscriber: Subscriber<R>, source: any): TeardownLogic {
        return source.subscribe(new ZoneSubscriber(subscriber, this.zone, this.uTask));
    }
}
