import { useThemedColormap } from '@carbonplan/colormaps'
import { useMemo } from 'react'

import useStore from '../store'
import { generateLogTicks } from './log'

export const getColorForValue = (
  value,
  colormap,
  currentVariable,
  { colorAdjustments } = {}
) => {
  const { colormap: colormapName, colorLimits, flipColormap } = currentVariable
  let scaledValue = (value - colorLimits[0]) / (colorLimits[1] - colorLimits[0])
  scaledValue = Math.max(0, Math.min(1, scaledValue))

  let index = Math.floor(scaledValue * (colormap.length - 1))

  if (!colormap[index]) {
    return 'primary'
  }

  if (colorAdjustments) {
    // handle divergent colormap
    if (colormapName === 'orangeblue') {
      // if in middle 1/3 of colormap
      if (index > colormap.length / 3 && index < (colormap.length * 2) / 3) {
        // use ends of colormap
        index = index < colormap.length / 2 ? 0 : colormap.length - 1
      }
    } else {
      // handle sequential colormaps
      // if in bottom 1/5 of colormap
      if (index < colormap.length / 5) {
        // pin to 20th percentile color
        index = Math.round(colormap.length / 5)
      }
    }
  }

  if (flipColormap) {
    index = colormap.length - 1 - index
  }

  // convert rgb array to string
  if (colormap[index]?.length === 3) {
    return `rgb(${colormap[index].join(',')})`
  }
  return colormap[index]
}

export const useVariableColormap = () => {
  const currentVariable = useStore((s) => s.currentVariable)
  const logScale = useStore((s) => s.logScale && s.currentVariable.logScale)

  const min = logScale
    ? currentVariable.logColorLimits[0]
    : currentVariable.colorLimits[0]
  const max = logScale
    ? currentVariable.logColorLimits[1]
    : currentVariable.colorLimits[1]
  const logLabels = logScale ? generateLogTicks(min, max) : null
  const colormapBase = logScale
    ? useThemedColormap(currentVariable.colormap, {
        count: logLabels.length,
      }).slice(1, logLabels.length)
    : useThemedColormap(currentVariable.colormap)

  const colormap = useMemo(() => {
    if (currentVariable.flipColormap) {
      return [...colormapBase].reverse()
    } else {
      return colormapBase
    }
  }, [colormapBase, currentVariable.flipColormap])

  return colormap
}
