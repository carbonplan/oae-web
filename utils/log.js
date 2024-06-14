export const getLogSafeMinMax = (min, max, colorLimits) => {
  const [clim0, clim1] = colorLimits
  let base
  if (clim0 < 0 && clim1 < 0) {
    base = [Math.min(clim0, max), Math.max(clim1, min)]
  } else {
    base = [Math.max(clim0, min), Math.min(clim1, max)]
  }

  return base.map((d) => {
    const factor = d < 0 ? -1 : 1
    const roundedLog10 = Math.round(Math.log10(Math.abs(d)))
    const result = factor * Math.pow(10, roundedLog10)
    return parseFloat(result.toPrecision(10))
    return result
  })
}

export const generateLogTicks = (min, max) => {
  if (min === 0 && max === 0) {
    return []
  }
  const factor = min < 0 && max < 0 ? -1 : 1
  const minExp = Math.ceil(Math.log10(Math.abs(min)))
  const maxExp = Math.floor(Math.log10(Math.abs(max)))
  const ticks = []
  for (let exp = minExp; exp <= maxExp; exp++) {
    ticks.push(factor * Number(Math.pow(10, exp)))
  }
  return ticks
}
