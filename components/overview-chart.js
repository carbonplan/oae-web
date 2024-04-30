import React, { useCallback, useEffect, useState } from 'react'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Box, Flex, useThemeUI } from 'theme-ui'

import useStore, { overviewVariable } from '../store'
import Timeseries from './timeseries'
import { openZarr, getChunk, getTimeSeriesData, loadZarr } from '../utils/zarr'
import { downloadCsv } from '../utils/csv'
import { getColorForValue } from '../utils/color'
import { Button } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'

const zarrUrl =
  'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store1b.zarr'

const toMonthsIndex = (year, startYear) => (year - startYear) * 12

const OverviewChart = ({ sx }) => {
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)
  const setHoveredRegion = useStore((state) => state.setHoveredRegion)
  const efficiencyLineData = useStore((state) => state.efficiencyLineData)
  const setEfficiencyLineData = useStore((state) => state.setEfficiencyLineData)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const regionsInView = useStore((state) => state.regionsInView)
  const colormap = useThemedColormap(overviewVariable?.colormap)
  const colorLimits = overviewVariable.colorLimits
  const [timeData, setTimeData] = useState([])
  const startYear = 0
  const endYear = 15

  const { theme } = useThemeUI()

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
    timeData.forEach((regionData, i) => {
      if (!regionsInView.has(i)) return
      const color = getColorForValue(
        regionData[regionData.length - 1][1],
        colormap,
        colorLimits
      )
      selected[i] = {
        id: i,
        color: theme.colors.primary,
        hoveredColor: color,
        strokeWidth: 1,
        data: regionData,
      }
    })
    setEfficiencyLineData(selected)
  }, [timeData, endYear, regionsInView])

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
      <Box sx={sx.heading}>efficiency</Box>
      <Box sx={{ fontSize: 0, color: 'secondary', my: 2 }}>
        Graph filtered to regions in current map view
      </Box>
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
        endYear={endYear}
        xLimits={[startYear, 15]}
        yLimits={[0, 1]}
        yLabels={{ title: 'OAE efficiency', units: '' }}
        selectedLines={efficiencyLineData}
        handleClick={handleClick}
        handleHover={handleHover}
      />
    </>
  )
}

export default OverviewChart
