import { Offset } from "@angular-skyhook/core";

export type Rect = Offset & { width: number; height: number};

export function scalarMult(a: Offset, k: number): Offset {
  return { x: a.x * k, y: a.y * k };
}
export function scalarDiv(a: Offset, k: number): Offset {
  return { x: a.x / k, y: a.y / k };
}
export function plus(a: Offset, b: Offset): Offset {
  return { x: a.x + b.x, y: a.y + b.y };
}
export function minus(a: Offset, b: Offset): Offset {
  return { x: a.x - b.x, y: a.y - b.y };
}
export function clone(a: Offset): Offset {
  return Object.assign({}, a);
}
export function fmap(f: (number) => number, a: Offset): Offset {
  return { x: f(a.x), y: f(a.y) }
}

export function alongEdge(width: number, height: number, x: number, y: number): Offset {
    if (x < 0) x = 0;

    if (x > width) x = width;
    if (y < 0) y = 0;
    if (y > height) y = height;
    return {x, y};
}
