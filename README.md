
# shrink-array v0.0.1

Create a new array based on the given array, but with a reduced length. The values in the given array are equally distributed into subsets  based on an average (determined by `given_length / new_length`).

```js
const shrink = require('shrink-array')

const arr = [1, 2, 3, 4]
shrink(arr, 2) // => [1.5, 3.5]
```

### Subset reducers

By default, the average value of each subset is used in the new array. You can change
this behavior by passing a "subset reducer", which is an object (or an object-returning
function) that dictates how values are derived from each subset.

Subset reducers always have `next(value, index)` and `done()` functions:

```js
shrink(arr, 2, {
  next(value, index) {
    // Every value in `arr` is passed in here.
    // The `index` is the zero-based location in the subset.
  },
  done() {
    // This function is called at the end of every
    // subset. It returns the value that represents
    // each subset.
  }
})
```

By passing a function instead of an object for the subset reducer,
you create a scope in which you can declare internal state for the
`next` and `done` functions you return.

Subset reducers also have optional properties:
- `length: number > 0`
- `start: number > 0`
- `end: number > 0`

Defining the `length` property only matters if a length wasn't passed as
the 2nd argument of `shrinkArray`.

The `start` property determines how many values at the start of the input array
should not be grouped into subsets, but still be passed to the reducer and
included in the output array.

The `end` property is identical to `start`, except it determines how many values
at the *end* of the input array should not be grouped, etc.

### Built-in reducers

There are currently 4 built-in subset reducers.

```js
let arr = [4, 2, 1]

// Use the average value of each subset. This is the default.
let avg = require('shrink-array/avg')

shrink(arr, 1, avg) // => 3.5

// Use the maximum value of each subset.
let max = require('shrink-array/max')

shrink(arr, 1, max) // => 4

// Use the last value of each subset.
let last = require('shrink-array/last')

shrink(arr, 1, last) // => 1

// Access a key of each object and pass it to another reducer.
let pluck = require('shrink-array/pluck')

arr = [{a: 2}, {a: 3}]
shrink(arr, 1, pluck('a', avg)) // => 2.5
```
