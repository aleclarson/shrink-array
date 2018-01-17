
const empty = {}

module.exports =
function max(options = empty) {
  let max
  return {
    length: options.length,
    start: options.start,
    end: options.end,
    next(value, i) {
      if (i == 0) {
        max = value
      } else if (value > max) {
        max = value
      }
    },
    done() {
      return max
    }
  }
}
