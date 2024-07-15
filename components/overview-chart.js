import React, { useCallback, useEffect, useMemo } from 'react'
import { Box, Divider, Flex, Label, useThemeUI } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import { useThemedColormap } from '@carbonplan/colormaps'

import useStore, { variables } from '../store'
import Timeseries from './timeseries'
import {
  openZarr,
  getChunk,
  getTimeSeriesData,
  downloadCsv,
  getColorForValue,
} from '../utils'
import DownloadCSV from './download-csv'
import Checkbox from './checkbox'

const toMonthsIndex = (year, startYear) => (year - startYear) * 12 - 1
const ids = Array.from({ length: 690 }, (_, i) => i)

const OverviewChart = ({ sx }) => {
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)
  const setHoveredRegion = useStore((state) => state.setHoveredRegion)
  const overviewLineData = useStore((state) => state.overviewLineData)
  const setOverviewLineData = useStore((state) => state.setOverviewLineData)
  const injectionDate = useStore(
    (state) =>
      Object.values(state.injectionSeason).findIndex((value) => value) + 1
  )
  const injectionMonthString = useStore((state) =>
    Object.keys(state.injectionSeason).find(
      (value) => state.injectionSeason[value]
    )
  )
  const filterToRegionsInView = useStore((state) => state.filterToRegionsInView)
  const setFilterToRegionsInView = useStore(
    (state) => state.setFilterToRegionsInView
  )
  const regionsInView = useStore((state) => state.regionsInView)
  const overviewElapsedTime = useStore((state) => state.overviewElapsedTime)
  const currentVariable = useStore((state) => state.currentVariable)
  const variableFamily = useStore((state) => state.variableFamily)
  const setActiveLineData = useStore((state) => state.setActiveLineData)
  const setLoading = useStore((state) => state.setLoading)
  const setRegionDataLoading = useStore((state) => state.setRegionDataLoading)

  const colormap = useThemedColormap(currentVariable.colormap, { count: 20 }) // low count prevents banding in gradient
  const startYear = 0

  const { theme } = useThemeUI()

  const hideFilter = typeof selectedRegion === 'number'

  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      setOverviewLineData(null)
      setActiveLineData(null)
      setLoading(true)
      setRegionDataLoading(true)
      const zarrUrl = variables[variableFamily].url
      const getter = await openZarr(zarrUrl, currentVariable.variable)
      const injectionChunkIndex = injectionDate - 1
      const raw =
        currentVariable.optionIndex !== undefined
          ? await getChunk(getter, [0, 0, injectionChunkIndex, 0])
          : await getChunk(getter, [0, 0, injectionChunkIndex])
      const timeSeriesData = getTimeSeriesData(
        raw,
        ids,
        startYear,
        currentVariable.optionIndex
      )

      const transformed = timeSeriesData.reduce((acc, regionData, index) => {
        acc[index] = {
          id: index,
          color: alpha(
            getColorForValue(
              regionData[overviewElapsedTime][1],
              colormap,
              currentVariable
            ),
            0.1
          )(theme),
          activeColor: theme.rawColors?.primary,
          strokeWidth: 2,
          data: regionData,
        }
        return acc
      }, {})

      setOverviewLineData(transformed)
      setLoading(false)
      setRegionDataLoading(false)
    }
    fetchTimeSeriesData()
  }, [injectionDate, currentVariable, variableFamily])

  useEffect(() => {
    if (!selectedRegion) {
      setActiveLineData(null)
    } else {
      const regionData = overviewLineData?.[selectedRegion]
      setActiveLineData(regionData || null)
    }
  }, [selectedRegion, overviewLineData])

  const selectedLines = useMemo(() => {
    const lineData = overviewLineData
    if (!lineData) return {}
    if (!filterToRegionsInView || !regionsInView) return lineData
    const selected = {}
    regionsInView.forEach((regionId) => {
      if (lineData[regionId]) {
        selected[regionId] = lineData[regionId]
      }
    })
    return selected
  }, [regionsInView, filterToRegionsInView, overviewLineData, selectedRegion])

  const handleClick = useCallback(
    (e) => {
      const id = parseInt(e.target.id)
      setSelectedRegion(id)
    },
    [setSelectedRegion]
  )

  const handleHover = useCallback(
    (region) => {
      setHoveredRegion(region)
    },
    [setHoveredRegion]
  )

  const handleCSVDownload = useCallback(() => {
    const totalMonths = 180
    const csvData = Array.from({ length: totalMonths }, (_, index) => ({
      month: index + 1,
      injection_month: injectionMonthString,
    }))
    Object.values(selectedLines).forEach((line) => {
      line.data.forEach(([year, value]) => {
        const monthIndex = toMonthsIndex(year, 0)
        csvData[monthIndex][`region_${line.id}`] = value
      })
    })
    const name = currentVariable.graphLabel
      ? `${currentVariable.graphLabel} ${currentVariable.label}`
      : currentVariable.label
    downloadCsv(
      csvData,
      `${filterToRegionsInView ? 'filtered_' : ''}${name}_timeseries.csv`
        .replace(/ /g, '_')
        .toLocaleLowerCase()
    )
  }, [selectedLines, toMonthsIndex])

  return (
    <Box sx={{ mb: 4 }}>
      <Divider sx={{ mt: 2, mb: 4 }} />
      <Box sx={sx.heading}>Time series</Box>

      <Flex sx={{ justifyContent: hideFilter ? 'flex-end' : 'space-between' }}>
        {!hideFilter && (
          <Checkbox
            checked={filterToRegionsInView}
            label='Filter to map view'
            onChange={(e) => setFilterToRegionsInView(e.target.checked)}
          />
        )}
        <DownloadCSV
          onClick={handleCSVDownload}
          disabled={
            Object.keys(selectedLines ? selectedLines : {}).length === 0
          }
          sx={{
            mb: 1,
          }}
        />
      </Flex>
      <Timeseries
        xLimits={[startYear, 15]}
        yLimits={currentVariable.colorLimits}
        yLabels={{
          title: currentVariable.graphLabel
            ? `${currentVariable.graphLabel}`
            : currentVariable.label,
          units:
            currentVariable.graphUnit !== undefined
              ? currentVariable.graphUnit
              : currentVariable.unit,
        }}
        selectedLines={selectedLines}
        elapsedYears={(overviewElapsedTime + 1) / 12}
        colormap={colormap}
        opacity={0.1}
        handleClick={hideFilter ? undefined : handleClick}
        handleHover={hideFilter ? undefined : handleHover}
        showActive
      />
    </Box>
  )
}

export default OverviewChart
