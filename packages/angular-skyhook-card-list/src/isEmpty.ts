/** @ignore
 * Returns isEmpty, whether it's an immutable List or an array
 */
export function isEmpty(list: any): boolean {
    if (typeof list["isEmpty"] === 'function') {
        // it's immutable
        return list["isEmpty"]();
    } else if (typeof list["length"] === 'number') {
        // it's an array
        return (list as Array<any>).length === 0;
    } else {
        return false;
    }
}

