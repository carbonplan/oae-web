import React, { useMemo, useEffect, useState } from 'react'
import useStore from '../store'
import { useShallow } from 'zustand/react/shallow'
import { Box, Flex } from 'theme-ui'
import {
  AxisLabel,
  Chart,
  Grid,
  Line,
  Plot,
  Point,
  Rect,
  Scatter,
  TickLabels,
  Ticks,
} from '@carbonplan/charts'
import { Badge, Button } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'
import { openZarr, getChunk, getTimeSeriesData, loadZarr } from '../utils/zarr'

const zarrUrl =
  'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store1b.zarr'

const toMonthsIndex = (year, startYear) => (year - startYear) * 12

const TimeseriesOverview = ({ sx, colormap, efficiencyColorLimits }) => {
  const {
    setSelectedRegion,
    hoveredRegion,
    setHoveredRegion,
    timeHorizon,
    injectionSeason,
    regionsInView,
  } = useStore(
    useShallow((state) => ({
      setSelectedRegion: state.setSelectedRegion,
      hoveredRegion: state.hoveredRegion,
      setHoveredRegion: state.setHoveredRegion,
      timeHorizon: state.timeHorizon,
      injectionSeason: state.injectionSeason,
      regionsInView: state.regionsInView,
    }))
  )
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
      if (regionsInView.has(index)) {
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

  const renderHoveredLine = () => {
    if (!hoveredLine) {
      return null
    }
    const color = getColorForValue(hoveredLine.data.slice(-1)[0][1])

    return (
      <>
        <Line
          key={hoveredRegion + '-hovered'}
          onClick={() => setSelectedRegion(hoveredRegion)}
          sx={{
            stroke: color,
            strokeWidth: 4,
            pointerEvents: 'none',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
          data={hoveredLine.data}
        />
        <Scatter
          sx={{ pointerEvents: 'none' }}
          color={color}
          size={10}
          x={(d) => d.x}
          y={(d) => d.y}
          data={[
            {
              x: endYear,
              y: hoveredLine.data.slice(-1)[0][1],
            },
          ]}
        />
      </>
    )
  }

  const renderDataBadge = () => {
    if (!hoveredLine) {
      return null
    }
    const lastDataPoint = hoveredLine?.data.slice(-1)[0]
    const y = lastDataPoint[1]
    return (
      <Point x={endYear} y={y} align={'center'} width={2}>
        <Badge
          sx={{
            fontSize: 1,
            height: '20px',
            mt: 2,
            bg: getColorForValue(y),
          }}
        >
          {y.toFixed(2)}
        </Badge>
      </Point>
    )
  }

  const getColorForValue = (value) => {
    let scaledValue =
      (value - efficiencyColorLimits[0]) /
      (efficiencyColorLimits[1] - efficiencyColorLimits[0])
    scaledValue = Math.max(0, Math.min(1, scaledValue))
    const index = Math.floor(scaledValue * (colormap.length - 1))
    if (!colormap[index]) {
      return 'rgba(0,0,0,0)'
    }
    // convert rgb array to string
    if (colormap[index]?.length === 3) {
      return `rgb(${colormap[index].join(',')})`
    }
    return colormap[index]
  }

  return (
    <Box sx={{ zIndex: 0, position: 'relative' }}>
      <Box sx={sx.heading}>efficiency</Box>
      <Box sx={{ width: '100%', height: '300px', pointerEvents: 'none' }}>
        <Chart x={[startYear, 15]} y={[0, 1]} padding={{ left: 60, top: 50 }}>
          <Flex sx={{ justifyContent: 'end', mb: 0, pointerEvents: 'auto' }}>
            <Button
              sx={{
                ...sx.label,
                fontSize: 0,
                '&:hover': { color: 'primary', cursor: 'pointer' },
              }}
              prefix={<Down sx={{ height: 10, mr: 0 }} />}
            >
              Download CSV
            </Button>
          </Flex>
          <Grid vertical horizontal />
          <Ticks left bottom />
          <TickLabels left bottom />
          <AxisLabel sx={{ fontSize: 0 }} left>
            OAE efficiency
          </AxisLabel>
          <AxisLabel units='years' sx={{ fontSize: 0 }} bottom>
            Time
          </AxisLabel>
          <Plot>
            {selectedLines.map((line, i) => (
              <Line
                key={i + '-selected'}
                onClick={() => setSelectedRegion(line.id)}
                onMouseOver={() => setHoveredRegion(line.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                sx={{
                  stroke: getColorForValue(line.data?.slice(-1)?.[0]?.[1]),
                  strokeWidth: 2,
                  pointerEvents: 'visiblePainted',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                data={line.data}
              />
            ))}
            {unselectedLines.map((line, i) => (
              <Line
                key={i + '-unselected'}
                onClick={() => setSelectedRegion(line.id)}
                onMouseOver={() => setHoveredRegion(line.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                sx={{
                  stroke: 'muted',
                  strokeWidth: 2,
                  pointerEvents: 'visiblePainted',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                data={line.data}
              />
            ))}
            <Rect x={[endYear, 15]} y={[0, 1]} color='muted' opacity={0.2} />
            {renderHoveredLine()}
          </Plot>
          {renderDataBadge()}
        </Chart>
      </Box>
    </Box>
  )
}

export default TimeseriesOverview
