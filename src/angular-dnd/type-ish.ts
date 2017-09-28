export type TypeIsh = string | symbol | Array<string|symbol> | Iterable<string|symbol>;
export type CreateTypeIsh<T> = (props: T) => TypeIsh;
export type TypeIshOrFunction<T> = TypeIsh | CreateTypeIsh<T>;

