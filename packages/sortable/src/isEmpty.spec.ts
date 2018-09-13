import { isEmpty } from './isEmpty';
import { List } from 'immutable';

describe('isEmpty', () => {
    it('should return true for []', () => {
        expect(isEmpty([])).toBe(true);
    });
    it('should return false for [x]', () => {
        expect(isEmpty([1])).toBe(false);
    });
    it('immutable should have an iterator', () => {
        const a = List<number>([1, 2, 3]);
        expect(a[Symbol.iterator]).toBeTruthy();
    });
    it('should return true for List()', () => {
        expect(isEmpty(List())).toBe(true);
    });
    it('should return false for List([x])', () => {
        const a = List([1]);
        expect(isEmpty(a)).toBe(false);
    });
});
