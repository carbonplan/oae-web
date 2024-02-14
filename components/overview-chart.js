import React, { useEffect, useMemo, useState } from 'react'
import { openZarr, getChunk, getTimeSeriesData, loadZarr } from '../utils/zarr'
import useStore, { overviewVariable } from '../store'
import { useThemedColormap } from '@carbonplan/colormaps'
import Timeseries from './timeseries'
import { Box } from 'theme-ui'

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
        selectedLines.push({ id: index, data: line.slice(0, cutIndex + 1) })
        unselectedLines.push({ id: index, data: line.slice(cutIndex + 1) })
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

  const handleClick = (region) => {
    setSelectedRegion(region)
  }
  const handleHover = (region) => {
    setHoveredRegion(region)
  }

  return (
    <>
      <Box sx={sx.heading}>efficiency</Box>
      <Timeseries
        endYear={timeHorizon}
        xLimits={[startYear, 15]}
        yLimits={[0, 1]}
        timeData={{
          selectedLines,
          unselectedLines,
          hoveredLine,
        }}
        colormap={colormap}
        colorLimits={colorLimits}
        handleClick={handleClick}
        handleHover={handleHover}
        hoveredRegion={hoveredRegion}
      />
    </>
  )
}

export default OverviewChart
