import React, { useCallback, useEffect, useState } from 'react'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Box, Checkbox, Flex, Label, useThemeUI } from 'theme-ui'
import { alpha } from '@theme-ui/color'

import useStore, { overviewVariable } from '../store'
import Timeseries from './timeseries'
import { openZarr, getChunk, getTimeSeriesData, loadZarr } from '../utils/zarr'
import { downloadCsv } from '../utils/csv'
import { getColorForValue } from '../utils/color'
import { Button, Colorbar, Column } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'

const zarrUrl =
  'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store1b.zarr'

const toMonthsIndex = (year, startYear) => (year - startYear) * 12 - 1

const OverviewChart = ({ sx }) => {
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)
  const setHoveredRegion = useStore((state) => state.setHoveredRegion)
  const efficiencyLineData = useStore((state) => state.efficiencyLineData)
  const setEfficiencyLineData = useStore((state) => state.setEfficiencyLineData)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const filterToRegionsInView = useStore((state) => state.filterToRegionsInView)
  const setFilterToRegionsInView = useStore(
    (state) => state.setFilterToRegionsInView
  )
  const regionsInView = useStore((state) => state.regionsInView)
  const overviewElapsedTime = useStore((state) => state.overviewElapsedTime)

  const colormap = useThemedColormap(overviewVariable?.colormap, { count: 20 }) // low count prevents banding in gradient
  const colorLimits = overviewVariable.colorLimits
  const [timeData, setTimeData] = useState([])
  const startYear = 0

  const { theme } = useThemeUI()

  const disableFilter = !!selectedRegion

  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      const variable = 'OAE_efficiency'
      const idZarr = await loadZarr(zarrUrl, 'polygon_id')
      const ids = idZarr.data
      const getter = await openZarr(zarrUrl, variable)
      const injectionDate =
        Object.values(injectionSeason).findIndex((value) => value) + 1
      const injectionChunkIndex = injectionDate - 1
      const raw = await getChunk(getter, [0, 0, injectionChunkIndex])
      const timeSeriesData = getTimeSeriesData(raw, ids, startYear)
      setTimeData(timeSeriesData)
    }
    fetchTimeSeriesData()
  }, [injectionSeason])

  useEffect(() => {
    let selected = {}
    const targetIndexes = filterToRegionsInView
      ? regionsInView || []
      : Object.keys(timeData) || []
    targetIndexes.forEach((index) => {
      const regionData = timeData[index]
      if (regionData) {
        const color = getColorForValue(
          regionData[overviewElapsedTime][1],
          colormap,
          colorLimits
        )
        const alphaColor = alpha(color, 0.1)(theme)
        selected[index] = {
          id: index,
          color: alphaColor,
          activeColor: theme.rawColors?.primary,
          strokeWidth: 2,
          data: regionData,
        }
      }
    })
    setEfficiencyLineData(selected)
  }, [
    timeData,
    regionsInView,
    filterToRegionsInView,
    overviewElapsedTime,
    theme,
  ])

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
    const totalMonths = timeData[0].length
    const csvData = Array.from({ length: totalMonths }, (_, index) => ({
      month: index + 1,
    }))
    timeData.forEach((line, lineIndex) => {
      line.forEach(([year, value]) => {
        const monthIndex = toMonthsIndex(year, 0)
        csvData[monthIndex][`region_${lineIndex}`] = value
      })
    })
    downloadCsv(csvData, `oae-efficiency-timeseries.csv`)
  }, [timeData, toMonthsIndex])

  return (
    <>
      <Box sx={{ ...sx.heading, mt: 4 }}>Efficiency</Box>
      <Label
        sx={{
          color: disableFilter ? 'muted' : 'secondary',
          cursor: 'pointer',
          fontSize: 1,
          fontFamily: 'mono',
          py: 1,
        }}
      >
        <Checkbox
          checked={filterToRegionsInView}
          onChange={(e) => setFilterToRegionsInView(e.target.checked)}
          disabled={disableFilter}
          sx={{
            width: 18,
            mr: 1,
            mt: '-3px',
            cursor: 'pointer',
            color: 'muted',
            transition: 'color 0.15s',
            'input:active ~ &': { bg: 'background', color: 'primary' },
            'input:focus ~ &': {
              bg: 'background',
              color: filterToRegionsInView ? 'primary' : 'muted',
            },
            'input:hover ~ &': {
              bg: 'background',
              color: disableFilter ? 'muted' : 'primary',
            },
            'input:focus-visible ~ &': {
              outline: 'dashed 1px rgb(110, 110, 110, 0.625)',
              background: 'rgb(110, 110, 110, 0.625)',
            },
          }}
        />
        Filter to map view
      </Label>
      <Flex sx={{ justifyContent: 'flex-end', height: 15 }}>
        <Button
          inverted
          disabled={
            Object.keys(efficiencyLineData ? efficiencyLineData : {}).length ===
            0
          }
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
        xLimits={[startYear, 15]}
        yLimits={[0, 1]}
        yLabels={{ title: 'OAE efficiency', units: '' }}
        selectedLines={efficiencyLineData}
        elapsedYears={(overviewElapsedTime + 1) / 12}
        colormap={colormap}
        opacity={0.1}
        handleClick={selectedRegion ? undefined : handleClick}
        handleHover={selectedRegion ? undefined : handleHover}
        shadeHorizon
        showActive
      />
    </>
  )
}

export default OverviewChart
