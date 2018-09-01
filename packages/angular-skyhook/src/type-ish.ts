/** String, symbol, or an array of either. Used on drop targets. */
export type TypeOrTypeArray = string | symbol | Array<string | symbol>;
/** Just a plain, reusable xy coordinate type. */
export interface Offset {
    /** x coordinate */
    x: number;
    /** y coordinate */
    y: number;
}

