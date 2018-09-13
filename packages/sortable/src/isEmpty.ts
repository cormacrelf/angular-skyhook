/** @ignore
 * Returns isEmpty, whether it's an immutable List or an array
 */
export function isEmpty(list: Iterable<any>): boolean {
    for (let _ of list) {
        return false;
    }
    return true;
}

