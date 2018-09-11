import { Offset } from "@angular-skyhook/core";

export function snapToGrid(n: number) {
  return (a: Offset) => {
    const snappedX = Math.round(a.x / n) * n;
    const snappedY = Math.round(a.y / n) * n;

    return { x: snappedX, y: snappedY };
  }
}
