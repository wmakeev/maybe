import test from 'tape'
import { maybe, just, nothing, Maybe, Just, Nothing } from './maybe'

test('valid values', t => {
  const x: Maybe<number> = maybe(1)

  const isJustRes: boolean = x.isJust()
  t.equals(isJustRes, true)

  const isNothing: boolean = x.isNothing()
  t.equals(isNothing, false)

  t.deepEquals(x, new Just(1))

  const y: Maybe<number> = maybe(0)
  t.equals(y.isJust(), true)
  t.equals(y.isNothing(), false)

  const z: Maybe<{}> = maybe({})
  t.equals(z.isJust(), true)
  t.equals(z.isNothing(), false)

  t.end()
})

test('empty values', t => {
  const x = maybe(null)
  t.equals(x.isNothing(), true)
  t.equals(x.isJust(), false)
  t.deepEquals(x, new Nothing())

  const y = maybe(undefined)
  t.equals(y.isNothing(), true)
  t.equals(y.isJust(), false)

  t.end()
})

test('extract value with just()', t => {
  const m: Maybe<string> = maybe('some value')
  const justResult: string | void = m.just()
  t.equals(justResult, 'some value')
  t.end()
})

test('just() should throw on an empty value', t => {
  const n = maybe(null)
  t.throws(n.just)
  t.end()
})

test('orJust', t => {
  const x = maybe(null)
  const orValue = x.orJust('hi')
  t.equals(orValue, 'hi')
  const y = maybe('hello')
  t.equals(y.orJust(), 'hello')
  t.end()
})

test('get value at path', t => {
  const x = maybe({
    foo: { bar: 123 }
  })
  const result: Maybe<number> = x.get<number>('foo.bar')
  t.deepEquals(result, maybe(123))
  const value = result.just()
  t.equals(value, 123)
  t.end()
})

test('get empty value is nothing', t => {
  const x = maybe({
    foo: { bar: 123 }
  })
  const result = x.get('baz.bar')
  t.equals(result, nothing)
  t.end()
})

test('map value', t => {
  const x = maybe('bob')
  const result = x.map(v => v.toUpperCase())
  t.deepEquals(result, maybe('BOB'))
  const value = result.just()
  t.equals(value, 'BOB')
  t.end()
})

test('map empty value is noop', t => {
  const n = maybe(null)
  const result = n.map(v => (v as any).toUpperCase())
  t.deepEquals(result, nothing)
  t.end()
})

test('map to check and convert nil', t => {
  const result = maybe(1).map(() => null)
  t.deepEquals(result, nothing)
  t.end()
})

test('chaining', t => {
  const a = maybe('Maybe  ')
  const b: string | void = a
    .map(v => v.trim())
    .map(v => v.toUpperCase())
    .just()
  t.equals(b, 'MAYBE')
  t.end()
})

test('flatMap', t => {
  const a = maybe('hi')
  const result = a.flatMap(
    (v: string): Maybe<string> => {
      if (v === 'hi') {
        return just('world')
      } else {
        return nothing
      }
    }
  )
  t.deepEquals(result, just('world'))
  t.end()
})

test('flatMap to check and convert nil', t => {
  // @ts-ignore
  const result = maybe(1).flatMap(() => null)
  t.deepEquals(result, nothing)
  t.end()
})

test('just() throws on empty values', t => {
  // @ts-ignore
  const fNull = () => just(null)
  t.throws(fNull)
  // @ts-ignore
  const fUndefined = () => just(undefined)
  t.throws(fUndefined)
  t.end()
})

test('filter() to return just', t => {
  const name = maybe('alex  ')
  const upper = name
    .map(v => v.trim())
    .filter(v => v.length !== 0)
    .map(v => v.toUpperCase())
  t.deepEquals(upper, just('ALEX'))
  t.end()
})

test('filter() to return nothing', t => {
  const name = maybe('  ')
  const upper = name
    .map(v => v.trim())
    .filter(v => v.length !== 0)
    .map(v => v.toUpperCase())
  t.equals(upper, nothing)
  t.end()
})

test('forEach() to side effect with value', t => {
  let effect
  const result = maybe('effect').forEach(v => (effect = v)) // eslint-disable-line no-return-assign
  t.equals(effect, 'effect')
  t.equals(result, void 0)
  t.end()
})

test('forEach() to not side effect with empty value', t => {
  let effect
  const result = maybe(null).forEach(v => (effect = v)) // eslint-disable-line no-return-assign
  t.equals(effect, void 0)
  t.equals(result, void 0)
  t.end()
})

test('orElse', t => {
  const x = maybe(null)
  t.deepEquals(x.orElse(maybe('hi')), just('hi'))
  const y = maybe('hello')
  t.deepEquals(y.orElse(maybe('world')), just('hello'))
  t.end()
})

test('ok', t => {
  const getSome = (s: string) => {
    return s === 'd' ? s : null
  }
  // const p: string | null = getSome('y')
  const n = maybe('f').map(v => getSome(v))
  const result = n.map(v => v.toUpperCase())
  t.deepEquals(result, nothing)
  t.end()
})
