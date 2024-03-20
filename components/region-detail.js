import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Checkbox, Divider, Label } from 'theme-ui'
import { Expander, Filter, Select } from '@carbonplan/components'
import AnimateHeight from 'react-animate-height'
import { useThemedColormap } from '@carbonplan/colormaps'
import { useRegion } from '@carbonplan/maps'

import TimeSlider from './time-slider'
import Timeseries from './timeseries'
import { getColorForValue } from '../utils/color'
import useStore, { variables } from '../store'
import { useBreakpointIndex } from '@theme-ui/match-media'

const toMonthsIndex = (year, startYear) => (year - startYear) * 12
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

const hoveredLine = null

const RegionDetail = ({ sx }) => {
  const currentVariable = useStore((s) => s.currentVariable)
  const setCurrentVariable = useStore((s) => s.setCurrentVariable)
  const variableFamily = useStore((s) => s.variableFamily)
  const setVariableFamily = useStore((s) => s.setVariableFamily)
  const showRegionPicker = useStore((s) => s.showRegionPicker)
  const setShowRegionPicker = useStore((s) => s.setShowRegionPicker)
  const regionData = useStore((s) => s.regionData)
  const timeHorizon = useStore((s) => s.timeHorizon)
  const elapsedYears = useStore((s) => s.elapsedTime / 12)
  const setElapsedTime = useStore((s) => s.setElapsedTime)
  const showBackgroundInDiff = useStore((s) => s.showBackgroundInDiff)
  const setShowBackgroundInDiff = useStore((s) => s.setShowBackgroundInDiff)

  const colormap = useThemedColormap(currentVariable?.colormap)
  const { region } = useRegion()
  const zoom = region?.properties?.zoom || 0
  const index = useBreakpointIndex()

  const [minMax, setMinMax] = useState([0, 0])
  const [lineAverageValue, setLineAverageValue] = useState(0)
  const [filterValues, setFilterValues] = useState({})
  const disableBGControl = currentVariable.calc === undefined

  useEffect(() => {
    const initialFilterValues = variables[variableFamily].variables.reduce(
      (acc, variable, index) => ({ ...acc, [variable.label]: index === 0 }),
      {}
    )
    setFilterValues(initialFilterValues)
  }, [variableFamily])

  const toLineData = useMemo(() => {
    if (!regionData) return []
    let averages = []
    if (currentVariable.calc) {
      const injected = regionData.outputs?.[currentVariable.calc[0]]
      const notInjected = regionData.outputs?.[currentVariable.calc[1]]
      if (!injected || !notInjected) return []
      averages = Object.values(injected).map((data, index) => {
        const avg = data.reduce(
          (acc, curr, i) =>
            acc + (curr - notInjected[index][i]) / (data.length - 1),
          0
        )
        const toYear = index / 12
        return [toYear, avg]
      })
    } else if (regionData.outputs && regionData.outputs[currentVariable.key]) {
      averages = Object.values(regionData.outputs[currentVariable.key]).map(
        (data, index) => {
          const { avg } = getArrayData(data, regionData.coordinates.lat, zoom)
          const toYear = index / 12
          return [toYear, avg]
        }
      )
    } else {
      return []
    }
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
      const selectedSlice = line.slice(0, cutIndex + 1)
      const unselectedSlice = line.slice(cutIndex)
      const avgValueForLine =
        selectedSlice.reduce((acc, curr) => acc + curr[1], 0) /
        selectedSlice.length
      setLineAverageValue(avgValueForLine)
      const color = getColorForValue(
        avgValueForLine,
        colormap,
        currentVariable.colorLimits,
        40
      )
      selectedLines.push({
        id: index,
        color,
        data: selectedSlice,
      })
      unselectedLines.push({
        id: index,
        color: 'muted',
        data: unselectedSlice,
      })
    })
    return { selectedLines, unselectedLines }
  }, [toLineData, timeHorizon, toMonthsIndex])

  const point = useMemo(() => {
    const y = selectedLines[0]?.data?.[toMonthsIndex(elapsedYears, 0)]?.[1]
    if (y === undefined) return null
    const color = getColorForValue(
      lineAverageValue,
      colormap,
      currentVariable.colorLimits,
      40
    )
    return {
      x: elapsedYears,
      y,
      color,
      text: y.toFixed(currentVariable.calc ? 3 : 1),
    }
  }, [elapsedYears, selectedLines, lineAverageValue, colormap, currentVariable])

  const handleFamilySelection = (e) => {
    setVariableFamily(e.target.value)
    setCurrentVariable(variables[e.target.value].variables[0])
  }

  const handleVariableSelection = (updatedValues) => {
    const selectedLabel = Object.keys(updatedValues).find(
      (label) => updatedValues[label]
    )
    if (selectedLabel) {
      const selectedVariable = variables[variableFamily].variables.find(
        (variable) => variable.label === selectedLabel
      )
      if (selectedVariable) {
        setCurrentVariable(selectedVariable)
        setFilterValues(updatedValues)
      }
    }
  }

  const handleTimeseriesClick = useCallback(
    (e) => {
      const { left, width } = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - left
      const months = Math.round((clickX / width) * 179)
      setElapsedTime(months)
    },
    [setElapsedTime]
  )

  return (
    <>
      <Divider sx={{ mt: 4, mb: 5 }} />
      <Box sx={sx.heading}>Variable</Box>
      <Select
        onChange={handleFamilySelection}
        value={variableFamily}
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
        {Object.keys(variables).map((variable) => (
          <option key={variable} value={variable}>
            {variables[variable].meta.label}
          </option>
        ))}
      </Select>

      <Box sx={{ mt: 3, mb: 2 }}>
        {Object.keys(filterValues).length && (
          <Filter
            key={variableFamily}
            values={filterValues}
            setValues={handleVariableSelection}
          />
        )}
        <Label
          sx={{
            opacity: disableBGControl ? 0.2 : 1,
            color: 'secondary',
            cursor: 'pointer',
            fontSize: 1,
            fontFamily: 'mono',
            pt: 2,
          }}
        >
          <Checkbox
            disabled={disableBGControl}
            value={showBackgroundInDiff}
            onChange={() => setShowBackgroundInDiff(!showBackgroundInDiff)}
            sx={{
              opacity: disableBGControl ? 0.2 : 1,
              width: 18,
              mr: 1,
              mt: '-3px',
            }}
          />
          show background variability
        </Label>
      </Box>
      <Box sx={{ ...sx.heading, mt: 4 }}>Time</Box>
      <Box sx={{ mb: [-3, -3, -3, -2], mt: 4 }}>
        <TimeSlider />
      </Box>
      {index >= 2 && (
        <>
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
              sx={{ width: 20, ml: 1 }}
            />
          </Box>

          <AnimateHeight duration={250} height={showRegionPicker ? 'auto' : 0}>
            <Timeseries
              endYear={timeHorizon}
              xLimits={[0, 15]}
              yLimits={minMax}
              yLabels={{
                title: currentVariable.label ?? '',
                units: currentVariable.unit ?? '',
              }}
              timeData={{ selectedLines, unselectedLines, hoveredLine }}
              handleClick={handleTimeseriesClick}
              handleHover={() => {}}
              point={point}
              xSelector={true}
              handleXSelectorClick={handleTimeseriesClick}
            />
          </AnimateHeight>
        </>
      )}
    </>
  )
}

export default RegionDetail
