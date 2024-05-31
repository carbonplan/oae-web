export const getColorForValue = (
  value,
  colormap,
  colorLimits,
  minIndex = 0
) => {
  let scaledValue = (value - colorLimits[0]) / (colorLimits[1] - colorLimits[0])
  scaledValue = Math.max(0, Math.min(1, scaledValue))
  const index = Math.max(
    minIndex,
    Math.floor(scaledValue * (colormap.length - 1))
  )
  if (!colormap[index]) {
    return 'rgba(0,0,0,0)'
  }
  // convert rgb array to string
  if (colormap[index]?.length === 3) {
    return `rgb(${colormap[index].join(',')})`
  }
  return colormap[index]
}

export const generateLogTicks = (min, max) => {
  const minExp = Math.ceil(Math.log10(min))
  const maxExp = Math.floor(Math.log10(max))
  const ticks = []
  for (let exp = minExp; exp <= maxExp; exp++) {
    ticks.push(Number(Math.pow(10, exp).toFixed(Math.abs(exp))))
  }
  return ticks
}
