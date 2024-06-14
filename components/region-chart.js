import React, { useCallback, useMemo, useState } from 'react'
import { Box, Divider, Flex } from 'theme-ui'
import { Button } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'
import { useRegion } from '@carbonplan/maps'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { Down, Search, X } from '@carbonplan/icons'

import Timeseries from './timeseries'
import PlaceholderChart from './placeholder-chart'
import useStore from '../store'
import {
  generateLogTicks,
  getColorForValue,
  downloadCsv,
  formatValue,
  getLogSafeMinMax,
} from '../utils'

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

const getArrayData = (arr, lats, zoom, unitConversion) => {
  const areas = lats
    .filter((l, i) => isValidElement(arr[i]))
    .map((lat) => areaOfPixelProjected(lat, zoom))
  const totalArea = areas.reduce((a, d) => a + d, 0)
  return arr
    .filter((el) => isValidElement(el))
    .reduce(
      (accum, el, i) => ({
        avg: accum.avg + el * unitConversion * (areas[i] / totalArea),
      }),
      { avg: 0 }
    )
}

const RegionChart = ({ sx }) => {
  const currentVariable = useStore((s) => s.currentVariable)
  const showRegionPicker = useStore((s) => s.showRegionPicker)
  const setShowRegionPicker = useStore((s) => s.setShowRegionPicker)
  const regionData = useStore((s) => s.regionData)
  const elapsedYears = useStore((s) => (s.detailElapsedTime + 1) / 12)
  const setDetailElapsedTime = useStore((s) => s.setDetailElapsedTime)
  const selectedRegion = useStore((s) => s.selectedRegion)
  const regionDataLoading = useStore((s) => s.regionDataLoading)
  const logScale = useStore((s) => s.logScale && s.currentVariable.logScale)

  const colormap = useThemedColormap(currentVariable?.colormap)
  const { region } = useRegion()
  const zoom = region?.properties?.zoom || 0
  const index = useBreakpointIndex()

  const [minMax, setMinMax] = useState([0, 0])
  const [lineAverageValue, setLineAverageValue] = useState(0)

  const toLineData = useMemo(() => {
    if (!regionData) return []
    const variableData = regionData[currentVariable.variable]
    const unitConversion = currentVariable.unitConversion ?? 1
    if (!variableData) return []
    let averages = []
    Array(15)
      .fill()
      .map((d, i) => i + 1)
      .map((year) => {
        Array(12)
          .fill()
          .map((d, i) => i + 1)
          .map((month) => {
            const { avg } = getArrayData(
              variableData[month][year],
              regionData.coordinates.lat,
              zoom,
              unitConversion
            )
            const toYear = year - 1 + (month - 1) / 12
            averages.push([toYear, avg])
          })
      })

    const [min, max] = averages.reduce(
      ([min, max], [_, value]) => [Math.min(min, value), Math.max(max, value)],
      [Infinity, -Infinity]
    )
    const logSafeMinMax = logScale
      ? getLogSafeMinMax(min, max, currentVariable.logColorLimits)
      : [min, max]
    setMinMax(logSafeMinMax)
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
        currentVariable,
        { colorAdjustments: true }
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
      currentVariable,
      { colorAdjustments: true }
    )
    return {
      x: elapsedYears,
      y,
      color,
      text: formatValue(y),
    }
  }, [elapsedYears, selectedLines, lineAverageValue, colormap, currentVariable])

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
    <Box sx={{ mb: 4, height: [0, 0, 390, 390] }}>
      {index >= 2 && (
        <>
          <Divider sx={{ mt: 4, mb: 5 }} />
          <Button
            suffix={
              showRegionPicker ? (
                <X sx={{ mt: -1 }} />
              ) : (
                <Search sx={{ mt: -1 }} />
              )
            }
            sx={sx.heading}
            size='md'
            onClick={() => setShowRegionPicker(!showRegionPicker)}
          >
            Time series
          </Button>

          {showRegionPicker ? (
            <>
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
                logy={logScale} // stale state during switch to log scale
                logLabels={logScale && generateLogTicks(minMax[0], minMax[1])}
              />
            </>
          ) : (
            <PlaceholderChart />
          )}
        </>
      )}
    </Box>
  )
}

export default RegionChart
