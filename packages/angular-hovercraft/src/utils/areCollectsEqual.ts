import { shallowEqual } from './shallowEqual';

export function areCollectsEqual(a: any, b: any) {
  if (a == null || b == null) {
    return false;
  }
  if (typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }

  return shallowEqual(a, b);
}
