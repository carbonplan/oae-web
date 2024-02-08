import React, { useMemo, useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import {
  AxisLabel,
  Chart,
  Grid,
  Line,
  Plot,
  Point,
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

const TimeseriesOverview = ({
  sx,
  setSelectedRegion,
  hoveredRegion,
  setHoveredRegion,
  timeHorizon,
  injectionSeason,
  regionsInView,
  colormap,
  efficiencyColorLimits,
}) => {
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
        selectedLines.push(line.slice(0, cutIndex + 1))
        unselectedLines.push(line.slice(cutIndex + 1))
      }
    })
    return { selectedLines, unselectedLines }
  }, [timeData, endYear, regionsInView, toMonthsIndex])

  const renderHoveredLine = () => {
    if (hoveredRegion === null || !selectedLines[hoveredRegion]?.length) {
      return null
    }
    const color = getColorForValue(selectedLines[hoveredRegion].slice(-1)[0][1])

    return (
      <>
        <Line
          key={hoveredRegion}
          onClick={() => setSelectedRegion(hoveredRegion)}
          onMouseOver={() => setHoveredRegion(hoveredRegion)}
          onMouseLeave={() => setHoveredRegion(null)}
          sx={{
            stroke: color,
            strokeWidth: 4,
            pointerEvents: 'visiblePainted',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
          data={selectedLines[hoveredRegion]}
        />
        <Scatter
          color={color}
          size={10}
          x={(d) => d.x}
          y={(d) => d.y}
          data={[
            {
              x: endYear,
              y: selectedLines[hoveredRegion].slice(-1)[0][1],
            },
          ]}
        />
      </>
    )
  }

  const renderDataBadge = () => {
    if (hoveredRegion === null || !selectedLines[hoveredRegion]?.length) {
      return null
    }

    const lastDataPoint = selectedLines[hoveredRegion].slice(-1)[0]
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
    return colormap[index]
  }

  return (
    <Box sx={{ zIndex: 0, position: 'relative' }}>
      <Box sx={sx.heading}>efficiency</Box>
      <Box sx={{ width: '100%', height: '300px', pointerEvents: 'none' }}>
        <Chart x={[startYear, 15]} y={[0, 1]} padding={{ left: 60, top: 50 }}>
          <Flex sx={{ justifyContent: 'end', mb: 0 }}>
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
                key={i}
                onClick={() => setSelectedRegion(i)}
                onMouseOver={() => setHoveredRegion(i)}
                onMouseLeave={() => setHoveredRegion(null)}
                sx={{
                  stroke: getColorForValue(line?.slice(-1)?.[0]?.[1]),
                  strokeWidth: 2,
                  pointerEvents: 'visiblePainted',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                data={line}
              />
            ))}
            {unselectedLines.map((line, i) => (
              <Line
                key={i}
                onClick={() => setSelectedRegion(i)}
                onMouseOver={() => setHoveredRegion(i)}
                onMouseLeave={() => setHoveredRegion(null)}
                sx={{
                  stroke: 'muted',
                  strokeWidth: 2,
                  pointerEvents: 'visiblePainted',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                data={line}
              />
            ))}
            {renderHoveredLine()}
          </Plot>
          {renderDataBadge()}
        </Chart>
      </Box>
    </Box>
  )
}

export default TimeseriesOverview
