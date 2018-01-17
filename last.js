
const empty = {}

module.exports =
function last(options = empty) {
  let last
  return {
    length: options.length,
    start: options.start,
    end: options.end,
    next: (val) => {last = val},
    done: () => last,
  }
}
