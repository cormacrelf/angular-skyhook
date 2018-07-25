export function invariant(assertion: boolean, msg: string) {
  if (!assertion) {
    throw new Error(msg);
  }
}

