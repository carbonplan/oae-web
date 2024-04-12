import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useThemedColormap } from '@carbonplan/colormaps'
import { Box, Flex } from 'theme-ui'

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
  const hoveredRegion = useStore((state) => state.hoveredRegion)
  const setHoveredRegion = useStore((state) => state.setHoveredRegion)
  const timeHorizon = useStore((state) => state.timeHorizon)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const regionsInView = useStore((state) => state.regionsInView)
  const colormap = useThemedColormap(overviewVariable?.colormap)
  const colorLimits = overviewVariable.colorLimits
  const [timeData, setTimeData] = useState([])
  const startYear = 0
  const endYear = startYear + timeHorizon

  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      const variable = 'OAE_efficiency'
      const idZarr = await loadZarr(zarrUrl, 'polygon_id')
      const ids = idZarr.data
      const getter = await openZarr(zarrUrl, variable)
      const injectionDate =
        Object.values(injectionSeason).findIndex((value) => value) + 1
      const injectionChunkIndex = injectionDate - 1
      const raw = await getChunk(getter, [0, injectionChunkIndex, 0])
      const timeSeriesData = getTimeSeriesData(raw, ids, startYear)
      setTimeData(timeSeriesData)
    }
    fetchTimeSeriesData()
  }, [injectionSeason])

  const { selectedLines, unselectedLines } = useMemo(() => {
    const selectedLines = []
    const unselectedLines = []
    timeData.forEach((line, index) => {
      if (regionsInView?.has(index)) {
        const cutIndex = toMonthsIndex(endYear, startYear)
        const color = getColorForValue(
          line[cutIndex - 1][1],
          colormap,
          colorLimits
        )
        selectedLines.push({
          id: index,
          color,
          data: line.slice(0, cutIndex + 1),
        })
        unselectedLines.push({
          id: index,
          color: 'muted',
          data: line.slice(cutIndex),
        })
      }
    })
    return { selectedLines, unselectedLines }
  }, [timeData, endYear, regionsInView, toMonthsIndex])

  const hoveredLine = useMemo(() => {
    if (hoveredRegion === null) {
      return null
    }
    return selectedLines.find((line) => line.id === hoveredRegion)
  }, [hoveredRegion, selectedLines])

  const color = useMemo(() => {
    if (!hoveredLine) {
      return 'rgba(0,0,0,0)'
    }
    return getColorForValue(
      hoveredLine.data.slice(-1)[0][1],
      colormap,
      colorLimits
    )
  }, [hoveredLine])

  const point = useMemo(() => {
    if (!hoveredLine) {
      return null
    }
    const lastDataPoint = hoveredLine.data.slice(-1)[0]
    return {
      x: endYear,
      y: lastDataPoint[1],
      color,
      text: lastDataPoint[1].toFixed(2),
    }
  }, [hoveredLine, endYear, color])

  const handleClick = (e) => {
    const id = parseInt(e.target.id)
    setSelectedRegion(id)
  }

  const handleHover = (region) => {
    setHoveredRegion(region)
  }

  const handleCSVDownload = useCallback(() => {
    const totalMonths = selectedLines[0].data.length
    const csvData = Array.from({ length: totalMonths }, (_, index) => ({
      month: index + 1,
    }))
    selectedLines.forEach((line, lineIndex) => {
      line.data.forEach(([year, value]) => {
        const monthIndex = toMonthsIndex(year, 0)
        csvData[monthIndex][`region_${lineIndex}`] = value
      })
    })
    downloadCsv(csvData, `oae-efficiency-timeseries.csv`)
  }, [selectedLines, toMonthsIndex])

  return (
    <>
      <Box sx={sx.heading}>efficiency</Box>
      <Box sx={{ fontSize: 0, color: 'secondary', my: 2 }}>
        Graph filtered to regions in current map view
      </Box>
      <Flex sx={{ justifyContent: 'flex-end', height: 15 }}>
        <Button
          inverted
          disabled={selectedLines.length === 0}
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
        endYear={timeHorizon}
        xLimits={[startYear, 15]}
        yLimits={[0, 1]}
        yLabels={{ title: 'OAE efficiency', units: '' }}
        timeData={{
          selectedLines,
          unselectedLines,
          hoveredLine,
        }}
        handleClick={handleClick}
        handleHover={handleHover}
        point={point}
      />
    </>
  )
}

export default OverviewChart
