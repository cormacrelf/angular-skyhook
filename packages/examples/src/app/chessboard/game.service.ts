import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface Coord { x: number; y: number; }

@Injectable()
export class GameService {

    knightPosition$ = new BehaviorSubject<Coord>({ x: 0, y: 0 });
    currentPosition: Coord;

    constructor() {
        this.knightPosition$.subscribe(kp => {
            this.currentPosition = kp;
        })
    }

    moveKnight = (to: Coord) => {
        this.knightPosition$.next(to);
    }

    canMoveKnight(to: Coord) {
        const { x, y } = this.currentPosition;
        const dx = to.x - x;
        const dy = to.y - y;

        return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
            (Math.abs(dx) === 1 && Math.abs(dy) === 2);
    }

}