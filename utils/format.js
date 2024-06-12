import { format } from 'd3-format'

export const formatValue = (value, options = {}) => {
  const test = Math.abs(value)
  if (test === 0) {
    return options[0] ? format(options[0])(0) : 0
  } else if (test < 0.001) {
    return format(options[0.001] ?? '.1e')(value)
  } else if (test < 0.01) {
    return format(options[0.01] ?? '.2')(value)
  } else if (test < 1) {
    return format(options[1] ?? '.2f')(value)
  } else if (test < 10) {
    return format(options[10] ?? '.1f')(value)
  } else if (test < 10000) {
    return format(options[10000] ?? '.0f')(value)
  } else {
    return format(options.default ?? '0.2s')(value)
  }
}

export const adjustLongitudeWorldCopy = (rawCoords, clickCoords) => {
  let adjustedLongitude = rawCoords[0]
  const diff = rawCoords[0] - clickCoords[0]
  if (diff < -180) {
    adjustedLongitude += 360
  } else if (diff > 180) {
    adjustedLongitude -= 360
  }
  return [adjustedLongitude, rawCoords[1]]
}
