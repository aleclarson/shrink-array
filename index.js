
const avg = require('./avg')

module.exports =
function shrinkArray(arr, arg2, arg3) {
  let len, options
  if (typeof arg2 == 'number') {
    len = arg2
    options = typeof arg3 == 'function' ? arg3() : arg3
    if (!options || !options.next) {
      options = avg(arg3)
    }
  } else {
    if (arguments.length == 2) arg3 = arg2
    options = arg3.next ? arg3 : avg(arg3)
    len = options.length
  }
  if (typeof len != 'number' || len < 1) {
    throw RangeError('Expected a positive length')
  }

  const imax = arr.length
  const {next, done} = options

  if (len >= imax) {
    // Process the array without grouping values.
    return arr.map(val => (next(val, 0), done()))
  }

  else if (len == 1) {
    arr.forEach(next)
    return done()
  }

  else {
    const res = []

    // The values before/after these indexes are never grouped,
    // but they're still included in the returned array.
    const start = (options.start || 0) - 1
    const end = imax - (options.end || 0)

    // `end` being NaN is bad news.
    if (isNaN(end)) {
      throw TypeError('`options.end` must be a number or undefined')
    }

    // The index within the input array
    let i = -1

    // Avoid grouping the first N values with `options.start`
    while (i < start) {
      next(arr[++i], 0)
      res[i] = done()
    }

    // `options.start` equals the desired length
    if (start == len - 1) {
      return res
    }

    // Remove preserved values from `len`
    len -= 1 + start + (options.end || 0)

    if (len) {
      // Average group size (maybe fractional)
      const gsize_avg = (end - start - 1) / len

      // To calculate the size of each group, the average size
      // is added to this variable whenever a new group begins.
      // Then, this variable is used to know when each group ends.
      let gend = i + gsize_avg

      // Size of the current group
      let gsize = 0

      // Total number of groups
      let gcount = 0

      // Group values in an evenly distributed way.
      while (true) {
        next(arr[++i], gsize++)
        if (i >= gend) {
          res.push(done())
          if (++gcount == len) {
            break
          }
          gsize = 0
          gend += gsize_avg

          // Ensure `gend` never rounds up to `end`
          if (Math.ceil(gend) >= end) {
            gend = end - 1
          }
        }
      }
    } else {
      i = end - 1
    }

    // Avoid grouping the last N values with `options.end`
    while (++i < imax) {
      next(arr[i], 0)
      res.push(done())
    }

    return res
  }
}
