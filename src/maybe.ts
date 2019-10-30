import get from 'lodash.get'

export type Maybe<A> = Nothing | Just<A>

type AnyVal =
  | number
  | boolean
  | string
  | Object
  | Array<any>
  | ReadonlyArray<any>

export class Just<A> {
  value: NonNullable<A>

  constructor(value: NonNullable<A>) {
    this.value = value
  }

  filter(p: (arg: A) => boolean): Maybe<A> {
    if (p(this.value)) {
      return this
    } else {
      return nothing
    }
  }

  flatMap<B extends AnyVal>(f: (arg: A) => Maybe<B>): Maybe<B> {
    const result = f(this.value)
    return isNil(result) ? nothing : result
  }

  forEach<B>(f: (arg: A) => B) {
    f(this.value)
  }

  isJust(): boolean {
    return true
  }

  isNothing(): boolean {
    return false
  }

  just(): A {
    return this.value
  }

  map<B extends AnyVal>(f: (arg: A) => B | null | undefined): Maybe<B> {
    const result = f(this.value)
    return isNil(result) ? nothing : new Just(result as NonNullable<B>)
  }

  get<B extends AnyVal>(path: string | Array<string>): Maybe<B> {
    return maybe(get(this.value, path))
  }

  orElse(): Maybe<A> {
    return this
  }

  orJust(): A {
    return this.value
  }
}

export class Nothing {
  filter(): Nothing {
    return this
  }

  flatMap(): Nothing {
    return this
  }

  forEach() {}

  isJust(): boolean {
    return false
  }

  isNothing(): boolean {
    return true
  }

  just() {
    throw Error('Cannot call just() on a Nothing')
  }

  map(): Nothing {
    return this
  }

  get(): Nothing {
    return this
  }

  orElse<B>(m: Maybe<B>): Maybe<B> {
    return m
  }

  orJust<B>(value?: B): B | void {
    return value
  }
}

function isNil<T>(value: T | null | undefined): boolean {
  return value == null
}

export function just<T extends AnyVal>(value: NonNullable<T>): Just<T> {
  if (isNil(value)) {
    throw Error('Cannot create Just with an empty value')
  }
  return new Just(value)
}

export const nothing: Nothing = Object.freeze(new Nothing())

export function maybe<T>(value: T | null | undefined): Maybe<T> {
  return isNil(value) ? nothing : new Just(value as NonNullable<T>)
}
