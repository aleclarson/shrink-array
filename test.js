
const tp = require('testpass')

const shrink = require('.')

const max = require('./max')
const last = require('./last')
const pluck = require ('./pluck')

tp.test('len == 1', (t) => {
  let arr = [1, 4, 3, 2]
  t.eq(shrink(arr, 1), 2.5)

  // Test with a custom processor.
  t.eq(shrink(arr, 1, last), 2)
})

tp.test('len == 2 (odd arr.length)', (t) => {
  const arr = [1, 2, 4, 8, 16]
  t.eq(shrink(arr, 2), [7/3, 12])
})

tp.test('len == 2 (even arr.length)', (t) => {
  const arr = [1, 3, 4, 6]
  t.eq(shrink(arr, 2), [2, 5])
})

tp.test('len == 3 (odd arr.length)', (t) => {
  const arr = [1, 2, 3, 4, 5, 6, 7]
  t.eq(shrink(arr, 3), [2, 4.5, 6.5])
})

tp.test('len == 3 (even arr.length)', (t) => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8]
  t.eq(shrink(arr, 3), [2, 5, 7.5])
})

tp.test('len == 10, arr.length == 25', (t) => {
  let i = 0, arr = new Array(25).fill().map(u => ++i)
  const res = shrink(arr, 10, last)

  // The sizes of each subset.
  ;[3, 2, 3, 2, 3, 2, 3, 2, 3, 2].forEach((count, i) => {
    const prev = i == 0 ? 0 : res[i - 1]
    t.eq(count, res[i] - prev)
  })
})

// Preserve the first value.
tp.test('{start: 1}', (t) => {
  const arr = [1, 2, 3, 4]
  t.eq(shrink(arr, 2), [1.5, 3.5])
  t.eq(shrink(arr, 2, {start: 1}), [1, 3])
})

// Preserve the last value.
tp.test('{end: 1}', (t) => {
  const arr = [1, 2, 3, 4]
  t.eq(shrink(arr, 2, {end: 1}), [2, 4])
})

// Preserve the first 2 values.
tp.test('{start: 2}', (t) => {
  const arr = [1, 2, 3, 4, 5]
  t.eq(shrink(arr, 3, {start: 2}), [1, 2, 4])
})

// Preserve the last 2 values.
tp.test('{end: 2}', (t) => {
  const arr = [1, 2, 3, 4, 5]
  t.eq(shrink(arr, 3, {end: 2}), [2, 4, 5])
})

// Preserve the first and last values.
tp.test('{start: 1, end: 1} (odd len, even arr.length)', (t) => {
  const arr = [1, 2, 3, 4, 5, 6]
  t.eq(shrink(arr, 3, {start: 1, end: 1}), [1, 3.5, 6])
})

// Preserve the first and last values.
tp.test('{start: 1, end: 1} (even len, odd arr.length)', (t) => {
  const arr = [1, 2, 3, 4, 5, 6, 7]
  t.eq(shrink(arr, 4, {start: 1, end: 1}), [1, 3, 5.5, 7])
})

tp.test('options.start == len', (t) => {
  const arr = [1, 2, 3, 4]
  t.eq(shrink(arr, 2, {start: 2}), [1, 2])
})

tp.test('options.end == len', (t) => {
  const arr = [1, 2, 3, 4]
  t.eq(shrink(arr, 2, {end: 2}), [3, 4])
})

// The values are mapped, no shrinking required.
tp.test('arr.length <= len', (t) => {
  let arr = [1, 2, 3]
  t.eq(shrink(arr, 3), arr)

  // Test with a custom processor.
  arr = [{ a: 1 }]
  t.eq(shrink(arr, 2, pluck('a', max)), [1])
})
