import React, { useCallback, useMemo, useState } from 'react'
import { Box, Checkbox, Divider, Flex, Label } from 'theme-ui'
import { Button, Expander, Filter, Select } from '@carbonplan/components'
import AnimateHeight from 'react-animate-height'
import { useThemedColormap } from '@carbonplan/colormaps'
import { useRegion } from '@carbonplan/maps'

import TimeSlider from './time-slider'
import Timeseries from './timeseries'
import TooltipWrapper from './tooltip'
import { getColorForValue } from '../utils/color'
import { downloadCsv } from '../utils/csv'
import useStore, { variables } from '../store'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { Down } from '@carbonplan/icons'

const toMonthsIndex = (year, startYear) => (year - startYear) * 12 - 1
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

const RegionDetail = ({ sx }) => {
  const currentVariable = useStore((s) => s.currentVariable)
  const setCurrentVariable = useStore((s) => s.setCurrentVariable)
  const variableFamily = useStore((s) => s.variableFamily)
  const setVariableFamily = useStore((s) => s.setVariableFamily)
  const showRegionPicker = useStore((s) => s.showRegionPicker)
  const setShowRegionPicker = useStore((s) => s.setShowRegionPicker)
  const regionData = useStore((s) => s.regionData)
  const elapsedYears = useStore((s) => (s.detailElapsedTime + 1) / 12)
  const setDetailElapsedTime = useStore((s) => s.setDetailElapsedTime)
  const showDeltaOverBackground = useStore((s) => s.showDeltaOverBackground)
  const setShowDeltaOverBackground = useStore(
    (s) => s.setShowDeltaOverBackground
  )
  const selectedRegion = useStore((s) => s.selectedRegion)
  const regionDataLoading = useStore((s) => s.regionDataLoading)

  const colormap = useThemedColormap(currentVariable?.colormap)
  const { region } = useRegion()
  const zoom = region?.properties?.zoom || 0
  const index = useBreakpointIndex()

  const [minMax, setMinMax] = useState([0, 0])
  const [lineAverageValue, setLineAverageValue] = useState(0)
  const disableBGControl = currentVariable.delta

  const filterValues = useMemo(() => {
    return variables[variableFamily].variables.reduce(
      (acc, variable, index) => ({
        ...acc,
        [variable.label]: currentVariable.label === variable.label,
      }),
      {}
    )
  }, [variableFamily, currentVariable])

  const toLineData = useMemo(() => {
    if (!regionData) return []
    const variableData = regionData[currentVariable.variable]
    if (!variableData) return []
    let averages = []
    if (currentVariable.delta) {
      const injected = variableData.experiment
      const notInjected = variableData.counterfactual
      if (!injected || !notInjected) return []

      Array(15)
        .fill()
        .map((d, i) => i + 1)
        .map((year) => {
          Array(12)
            .fill()
            .map((d, i) => i + 1)
            .map((month) => {
              const data = injected[month][year].map(
                (injectedEl, i) => injectedEl - notInjected[month][year][i]
              )
              const { avg } = getArrayData(
                data,
                regionData.coordinates.lat,
                zoom
              )
              const toYear = year - 1 + month / 12
              averages.push([toYear, avg])
            })
        })
    } else if (variableData) {
      Array(15)
        .fill()
        .map((d, i) => i + 1)
        .map((year) => {
          Array(12)
            .fill()
            .map((d, i) => i + 1)
            .map((month) => {
              const { avg } = getArrayData(
                variableData.experiment[month][year],
                regionData.coordinates.lat,
                zoom
              )
              const toYear = year - 1 + (month - 1) / 12
              averages.push([toYear, avg])
            })
        })
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

  const selectedLines = useMemo(() => {
    const selected = {}
    Object.entries(toLineData).forEach(([id, line]) => {
      const avgValueForLine =
        line.reduce((acc, curr) => acc + curr[1], 0) / line.length
      setLineAverageValue(avgValueForLine)
      const color = getColorForValue(
        avgValueForLine,
        colormap,
        currentVariable.colorLimits,
        50
      )
      selected[id] = {
        id: id,
        color,
        strokeWidth: 2,
        data: line,
      }
    })
    return selected
  }, [toLineData, toMonthsIndex, colormap, currentVariable.colorLimits])

  const point = useMemo(() => {
    const y = selectedLines[0]?.data?.[toMonthsIndex(elapsedYears, 0)]?.[1]
    if (y === undefined) return null
    const color = getColorForValue(
      lineAverageValue,
      colormap,
      currentVariable.colorLimits,
      50
    )
    return {
      x: elapsedYears,
      y,
      color,
      text: y.toFixed(currentVariable.delta ? 3 : 1),
    }
  }, [elapsedYears, selectedLines, lineAverageValue, colormap, currentVariable])

  const handleFamilySelection = useCallback(
    (e) => {
      setVariableFamily(e.target.value)
      setCurrentVariable(variables[e.target.value].variables[0])
    },
    [setVariableFamily, setCurrentVariable, variables]
  )

  const handleVariableSelection = useCallback(
    (updatedValues) => {
      const selectedLabel = Object.keys(updatedValues).find(
        (label) => updatedValues[label]
      )
      if (selectedLabel) {
        const selectedVariable = variables[variableFamily].variables.find(
          (variable) => variable.label === selectedLabel
        )
        if (selectedVariable) {
          setCurrentVariable(selectedVariable)
        }
      }
    },
    [variableFamily, setCurrentVariable]
  )

  const handleTimeseriesClick = useCallback(
    (e) => {
      const { left, width } = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - left
      const years = Math.floor((clickX / width) * 15)
      const months = years * 12 + (((elapsedYears * 12) % 12) - 1)
      setDetailElapsedTime(Math.min(Math.max(0, months), 179))
    },
    [setDetailElapsedTime, elapsedYears]
  )

  const handleCSVDownload = useCallback(() => {
    const data = selectedLines[0]?.data.map((d) => ({
      month: toMonthsIndex(d[0], 0) + 1,
      value: d[1],
    }))
    downloadCsv(
      data,
      `region-${selectedRegion}-${currentVariable.variable}${
        currentVariable.delta ? '-delta' : ''
      }-${currentVariable.unit}.csv`
    )
  }, [selectedLines])

  return (
    <>
      <Divider sx={{ mt: 4, mb: 5 }} />
      <Box sx={sx.heading}>Variable</Box>
      <Box sx={{ mt: 4 }}>
        <Select
          onChange={handleFamilySelection}
          value={variableFamily}
          size='xs'
          sx={{
            width: '100%',
            mr: 2,
            mb: 1,
          }}
          sxSelect={{
            fontFamily: 'mono',
            width: '100%',
          }}
        >
          {Object.keys(variables).map((variable) => (
            <option key={variable} value={variable}>
              {variables[variable].meta.label}
            </option>
          ))}
        </Select>
        <Box sx={{ fontSize: 0, color: 'secondary' }}>
          {variables[variableFamily]?.meta?.description}
        </Box>
      </Box>
      <Box sx={{ mt: 3, mb: 2 }}>
        <TooltipWrapper tooltip='Toggle between a view of the shift in the selected variable and its total values.'>
          {Object.keys(filterValues).length && (
            <Filter
              key={variableFamily}
              values={filterValues}
              setValues={handleVariableSelection}
            />
          )}
        </TooltipWrapper>
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
            checked={showDeltaOverBackground}
            onChange={(e) => setShowDeltaOverBackground(e.target.checked)}
            sx={{
              opacity: disableBGControl ? 0.2 : 1,
              width: 18,
              mr: 1,
              mt: '-3px',
              cursor: 'pointer',
              color: 'muted',
              transition: 'color 0.15s',
              'input:active ~ &': { bg: 'background', color: 'primary' },
              'input:focus ~ &': {
                bg: 'background',
                color: showDeltaOverBackground ? 'primary' : 'muted',
              },
              'input:hover ~ &': { bg: 'background', color: 'primary' },
              'input:focus-visible ~ &': {
                outline: 'dashed 1px rgb(110, 110, 110, 0.625)',
                background: 'rgb(110, 110, 110, 0.625)',
              },
            }}
          />
          show change footprint
        </Label>
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
            <Flex sx={{ justifyContent: 'flex-end', mb: 2, height: 15 }}>
              <Button
                inverted
                disabled={selectedLines.length === 0 || regionDataLoading}
                onClick={handleCSVDownload}
                sx={{
                  fontSize: 0,
                  textTransform: 'uppercase',
                  fontFamily: 'mono',
                  '&:disabled': {
                    color: 'muted',
                    pointerEvents: 'none',
                  },
                }}
              >
                <Down sx={{ height: 10, width: 10, mr: 1 }} />
                Download CSV
              </Button>
            </Flex>
            <Timeseries
              xLimits={[0, 15]}
              yLimits={minMax}
              yLabels={{
                title: currentVariable.label ?? '',
                units: currentVariable.unit ?? '',
              }}
              selectedLines={selectedLines}
              elapsedYears={elapsedYears}
              handleClick={handleTimeseriesClick}
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
