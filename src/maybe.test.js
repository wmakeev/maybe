/**
 * @flow
 */

import { maybe, just, nothing, Just, Nothing } from './maybe'
import type { Maybe } from './maybe'

test('valid values', () => {
  const x: Maybe<*> = maybe(1)
  expect(x.isJust()).toBe(true)
  expect(x.isNothing()).toBe(false)
  expect(x).toEqual(new Just(1))
  const y = maybe(0)
  expect(y.isJust()).toBe(true)
  expect(y.isNothing()).toBe(false)
  const z = maybe({})
  expect(z.isJust()).toBe(true)
  expect(z.isNothing()).toBe(false)
})

test('empty values', () => {
  const x = maybe(null)
  expect(x.isNothing()).toBe(true)
  expect(x.isJust()).toBe(false)
  expect(x).toEqual(new Nothing())
  const y = maybe(undefined)
  expect(y.isNothing()).toBe(true)
  expect(y.isJust()).toBe(false)
})

test('extract value with just()', () => {
  const m = maybe('some value')
  expect(m.just()).toBe('some value')
})

test('just() should throw on an empty value', () => {
  const n = maybe(null)
  expect(n.just).toThrow()
})

test('orJust', () => {
  const x = maybe(null)
  const orValue = x.orJust('hi')
  expect(orValue).toBe('hi')
  const y = maybe('hello')
  expect(y.orJust()).toBe('hello')
})

test('get value at path', () => {
  const x = maybe({
    foo: { bar: 123 },
  })
  const result = x.get('foo.bar')
  expect(result).toEqual(maybe(123))
  const value = result.just()
  expect(value).toBe(123)
})

test('get empty value is nothing', () => {
  const x = maybe({
    foo: { bar: 123 },
  })
  const result = x.get('baz.bar')
  expect(result).toEqual(nothing)
})

test('map value', () => {
  const x = maybe('bob')
  const result = x.map(v => v.toUpperCase())
  expect(result).toEqual(maybe('BOB'))
  const value = result.just()
  expect(value).toBe('BOB')
})

test('map empty value is noop', () => {
  const n = maybe(null)
  const result = n.map(v => v.toUpperCase())
  expect(result).toEqual(nothing)
})

test('chaining', () => {
  const a = maybe('Maybe  ')
  const b = a
    .map(v => v.trim())
    .map(v => v.toUpperCase())
    .just()
  expect(b).toBe('MAYBE')
})

test('flatMap', () => {
  const a = maybe('hi')
  const result = a.flatMap((v: string): Maybe<string> => {
    if (v === 'hi') {
      return just('world')
    } else {
      return nothing
    }
  })
  expect(result).toEqual(just('world'))
})

test('flatMap to check and convert nil', () => {
  // $FlowExpectedError
  const result = maybe(1).flatMap(() => null)
  expect(result).toEqual(nothing)
})

test('just() throws on empty values', () => {
  // $FlowExpectedError
  const fNull = () => just(null)
  expect(fNull).toThrow()
  // $FlowExpectedError
  const fUndefined = () => just(undefined)
  expect(fUndefined).toThrow()
})

test('filter() to return just', () => {
  const name = maybe('alex  ')
  const upper = name
    .map(v => v.trim())
    .filter(v => v.length !== 0)
    .map(v => v.toUpperCase())
  expect(upper).toEqual(just('ALEX'))
})

test('filter() to return nothing', () => {
  const name = maybe('  ')
  const upper = name
    .map(v => v.trim())
    .filter(v => v.length !== 0)
    .map(v => v.toUpperCase())
  expect(upper).toBe(nothing)
})

test('forEach() to side effect with value', () => {
  let effect
  const result = maybe('effect').forEach(v => effect = v) // eslint-disable-line no-return-assign
  expect(effect).toBe('effect')
  expect(result).toBeUndefined()
})

test('forEach() to not side effect with empty value', () => {
  let effect
  const result = maybe(null).forEach(v => effect = v) // eslint-disable-line no-return-assign
  expect(effect).toBeUndefined()
  expect(result).toBeUndefined()
})

test('orElse', () => {
  const x = maybe(null)
  expect(x.orElse(maybe('hi'))).toEqual(just('hi'))
  const y = maybe('hello')
  expect(y.orElse(maybe('world'))).toEqual(just('hello'))
})
