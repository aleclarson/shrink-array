
const empty = {}

module.exports =
function avg(options = empty) {
  let sum, count
  return {
    length: options.length,
    start: options.start,
    end: options.end,
    next(value, i) {
      if (i == 0) {
        sum = value
        count = 1
      } else {
        sum += value
        count += 1
      }
    },
    done() {
      return sum / count
    }
  }
}
