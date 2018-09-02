/**
 * @flow
 */

import get from 'lodash.get'

export type Maybe<A> = Just<A> | Nothing

type AnyVal = number | boolean | string | Object | Array<*> | $ReadOnlyArray<*>

class Just<A> {

  value: A

  constructor(value: $NonMaybeType<A>) {
    this.value = value
  }

  filter(p: (A) => boolean): Maybe<A> {
    if (p(this.value)) {
      return this
    } else {
      return nothing
    }
  }

  flatMap<B: AnyVal>(f: (A) => Maybe<B>): Maybe<B> {
    const result = f(this.value)
    return isNil(result) ? nothing : result
  }

  forEach<B>(f: (A) => B) {
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

  map<B: AnyVal>(f: (A) => B): Maybe<B> {
    return new Just(f(this.value))
  }

  get<B: AnyVal>(path: string | Array<string>): Maybe<B> {
    return maybe(get(this.value, path))
  }

  orElse(): Maybe<A> {
    return this
  }

  orJust(): A {
    return this.value
  }

}

class Nothing {

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

  orJust<B>(value: B): B {
    return value
  }

}

function isNil<T>(value: ?T): boolean {
  return value == null
}

export function just<T>(value: AnyVal): Just<T> {
  if (isNil(value)) {
    throw Error('Cannot create Just with an empty value: use flowtype!')
  }
  return new Just(value)
}

export const nothing: Nothing = Object.freeze(new Nothing())

export function maybe<T>(value: ?T): Maybe<T> {
  return isNil(value) ? nothing : new Just(value)
}
