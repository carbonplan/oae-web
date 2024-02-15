import React, { useMemo, useState } from 'react'
import { Box, Divider } from 'theme-ui'
import { Expander, Select } from '@carbonplan/components'
import AnimateHeight from 'react-animate-height'
import { useThemedColormap } from '@carbonplan/colormaps'
import { useRegion } from '@carbonplan/maps'

import TimeSlider from './time-slider'
import Timeseries from './timeseries'
import { getColorForValue } from '../utils/color'
import useStore, { variables } from '../store'

const toMonthsIndex = (year, startYear) => (year - startYear) * 12

const RegionDetail = ({ sx }) => {
  const currentVariable = useStore((state) => state.currentVariable)
  const setCurrentVariable = useStore((state) => state.setCurrentVariable)
  const showRegionPicker = useStore((state) => state.showRegionPicker)
  const setShowRegionPicker = useStore((state) => state.setShowRegionPicker)
  const regionData = useStore((state) => state.regionData)
  const timeHorizon = useStore((state) => state.timeHorizon)
  const elapsedYears = useStore((state) => state.elapsedTime / 12)

  const colormap = useThemedColormap(currentVariable?.colormap)
  const { region } = useRegion()
  const zoom = region?.properties?.zoom || 0

  const [minMax, setMinMax] = useState([0, 0])

  const degToRad = (degrees) => {
    return degrees * (Math.PI / 180)
  }
  const areaOfPixelProjected = (lat, zoom) => {
    const c = 40075016.686 / 1000
    return Math.pow(
      (c * Math.cos(degToRad(lat))) / Math.pow(2, Math.floor(zoom) + 7),
      2
    )
  }

  const isValidElement = (el) =>
    el !== 0 && el !== 9.969209968386869e36 && !isNaN(el)

  const getArrayData = (arr, lats, zoom) => {
    const areas = lats
      .filter((l, i) => isValidElement(arr[i]))
      .map((lat) => areaOfPixelProjected(lat, zoom))
    const totalArea = areas.reduce((a, d) => a + d, 0)
    return arr
      .filter((el) => isValidElement(el))
      .reduce(
        (accum, el, i) => ({
          avg: accum.avg + el * (areas[i] / totalArea),
        }),
        { avg: 0 }
      )
  }

  const toLineData = useMemo(() => {
    if (!currentVariable || !regionData?.[currentVariable.key]) return []

    const averages = Object.values(regionData[currentVariable.key]).map(
      (data, index) => {
        const { avg } = getArrayData(data, regionData.coordinates.lat, zoom)
        const toYear = index / 12
        return [toYear, avg]
      }
    )
    const [min, max] = averages.reduce(
      ([min, max], [_, value]) => [Math.min(min, value), Math.max(max, value)],
      [Infinity, -Infinity]
    )
    setMinMax([min, max])
    return [averages]
  }, [regionData, currentVariable])

  const { selectedLines, unselectedLines } = useMemo(() => {
    const selectedLines = []
    const unselectedLines = []
    toLineData.forEach((line, index) => {
      const cutIndex = toMonthsIndex(timeHorizon, 0)
      const color = getColorForValue(
        line[cutIndex - 1][1],
        colormap,
        currentVariable.colorLimits
      )
      selectedLines.push({
        id: index,
        color,
        data: line.slice(0, cutIndex + 1),
      })
      unselectedLines.push({
        id: index,
        color: 'muted',
        data: line.slice(cutIndex + 1),
      })
    })
    return { selectedLines, unselectedLines }
  }, [regionData, timeHorizon, toMonthsIndex])
  const hoveredLine = null

  const point = useMemo(() => {
    const y = selectedLines[0]?.data?.[toMonthsIndex(elapsedYears, 0)]?.[1]
    if (!y) return null
    const color = getColorForValue(y, colormap, currentVariable.colorLimits)
    return { x: elapsedYears, y, color, text: y.toFixed(0) }
  }, [elapsedYears, selectedLines])

  const handleSelection = (e) => {
    const selectedVariable = variables.find(
      (variable) => variable.key === e.target.value
    )
    setCurrentVariable(selectedVariable)
  }

  return (
    <>
      <Divider sx={{ mt: 4, mb: 5 }} />
      <Box sx={sx.heading}>Variables</Box>
      <Select
        onChange={handleSelection}
        value={currentVariable.key}
        size='xs'
        sx={{
          width: '100%',
          mt: 2,
        }}
        sxSelect={{
          fontFamily: 'mono',
          width: '100%',
          mt: 2,
        }}
      >
        {variables.map((variable) => (
          <option key={variable.key} value={variable.key}>
            {variable.label}
          </option>
        ))}
      </Select>
      <Box sx={{ mb: [-3, -3, -3, -2], mt: 4 }}>
        <TimeSlider />
      </Box>
      <Divider sx={{ mt: 4, mb: 5 }} />
      <Box
        onClick={() => setShowRegionPicker(!showRegionPicker)}
        sx={{
          ...sx.heading,
          cursor: 'pointer',
          '&:hover #expander': {
            stroke: 'primary',
          },
        }}
      >
        Time Series
        <Expander
          id='expander'
          value={showRegionPicker}
          sx={{ width: 20, ml: 2 }}
        />
      </Box>
      <AnimateHeight duration={500} height={showRegionPicker ? 'auto' : 0}>
        <Timeseries
          endYear={timeHorizon}
          xLimits={[0, 15]}
          yLimits={minMax}
          yLabels={{
            title: currentVariable.label ?? '',
            units: currentVariable.unit ?? '',
          }}
          timeData={{ selectedLines, unselectedLines, hoveredLine }}
          handleClick={() => {}}
          handleHover={() => {}}
          point={point}
        />
      </AnimateHeight>
    </>
  )
}

export default RegionDetail
