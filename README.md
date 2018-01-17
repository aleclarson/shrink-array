
# shrink-array v0.0.1

Create a new array based on the given array, but with a reduced length. The values in the given array are equally distributed into subsets  based on an average (determined by `given_length / new_length`).

```js
const shrink = require('shrink-array')

const arr = [1, 2, 3, 4]
shrink(arr, 2) // => [1.5, 3.5]
```

By default, the average value of each subset is used in the new array. But you can pass what's known as a "processor" (an object or function) to customize the value derived from each subset.

```js
shrink(arr, 2, {
  next(value, index) {
    // Every value in `arr` is passed in here.
    // The `index` represents location in the subset.
  },
  done() {
    // This function is called at the end of every
    // subset. It returns the value that represents
    // each subset.
  }
})
```

When the processor is a function, it's called immediately by `shrinkArray` with no arguments. You can use this function to declare internal state for the `next` and `done` functions.

In addition to the `next` and `done` functions, you can also define the `start` and/or `end` properties. Define `start` as a number above 0 to preserve the values at each index before it. Define `end` as a number above 0 to preserve values the the end of the input array. "Preserving" the values means they won't be grouped into a subset, thus their values are not lost or obscured. Though, they are still passed to the `next` function for processing.

### Built-in processors

Currently, there are only 2 built-in processors.

```js
// Use the maximum value of each subset.
const max = require('shrink-array/max')

// Use the average value of each subset. This is the default.
const avg = require('shrink-array/avg')
```
