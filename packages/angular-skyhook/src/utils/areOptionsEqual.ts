import { shallowEqual } from './shallowEqual';

export default function areOptionsEqual(nextOptions: any, currentOptions: any) {
  if (currentOptions === nextOptions) {
    return true;
  }

  return currentOptions !== null &&
         nextOptions !== null &&
         shallowEqual(currentOptions, nextOptions);
}
