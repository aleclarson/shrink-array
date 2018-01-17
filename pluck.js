
module.exports =
function pluck(key, reducer) {
  if (typeof reducer == 'function') {
    reducer = reducer()
  }
  const {next} = reducer
  reducer.next = (value, i) => next(value[key], i)
  return reducer
}
