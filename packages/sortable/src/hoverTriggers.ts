import { HoverTrigger } from './types';
import { Offset } from '@angular-skyhook/core';
import { RenderContext, DraggedItem } from './types';

//     ~ List ~
// [
//   [ index 0 ]
//   [ index 1 ] <-- index 1 gets picked up
//   [ index 2 ]
// ]
//
// We want to emit a hover when:
//   - the mouse moves over the top half of 0
//   - the mouse moves over the bottom half of 2
//
// ,----------------------,
// | target 0 top half    | => emits 0
// |----------------------|
// | target 0 bottom half | => computes 1, doesn't emit
// '----------------------'
// ,----------------------,
// | target 1 (inert)     | => computes 1, doesn't emit
// '----------------------'
// ,----------------------,
// | target 2 top half    | => computes 1, doesn't emit
// |----------------------|
// | target 2 bottom half | => emits 2
// '----------------------'
//

export function suggestHalfway<Data>(
    ctx: RenderContext<Data>,
    item: DraggedItem<Data>,
    rect: DOMRect|ClientRect,
    clientOffset: Offset
) {
    const { hover } = item;
    const dim = ctx.horizontal
        ? (rect.width || rect.right - rect.left)
        : (rect.height || rect.bottom - rect.top);
    const start = ctx.horizontal ? rect.left : rect.top;
    const targetCentre = start + dim / 2.0;
    const mouse = ctx.horizontal ? clientOffset.x : clientOffset.y;
    const topHalf = mouse < targetCentre;
    let suggestedIndex: number;
    if (ctx.listId === hover.listId) {
        if (ctx.index < hover.index) {
            suggestedIndex = topHalf ? ctx.index : ctx.index + 1;
        } else {
            suggestedIndex = topHalf ? ctx.index - 1 : ctx.index;
        }
    } else {
        // first hover on a different list;
        // there is no relevant hover.index to compare to
        suggestedIndex = topHalf ? ctx.index : ctx.index + 1;
    }
    return suggestedIndex;
};

export function suggestFixed<Data>(ctx: RenderContext<Data>) {
    return ctx.index;
};

export function getSuggester(trigger: HoverTrigger) {
    switch (trigger) {
        case HoverTrigger.fixed:
            return suggestFixed;
        default:
            return suggestHalfway;
    }
}
