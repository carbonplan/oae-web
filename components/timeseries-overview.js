import React, { useMemo, useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import {
  AxisLabel,
  Chart,
  Grid,
  Line,
  Plot,
  TickLabels,
  Ticks,
} from '@carbonplan/charts'
import { Button } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'
import { openZarr, getChunk, getTimeSeriesData } from '../utils/zarr'

const TimeseriesOverview = ({
  sx,
  setSelectedRegion,
  hoveredRegion,
  setHoveredRegion,
  timeHorizon,
  injectionSeason,
}) => {
  const [timeData, setTimeData] = useState([])
  const startYear = 1999
  const endYear = startYear + timeHorizon

  useEffect(() => {
    const fetchTimeSeriesData = async (variable) => {
      const getter = await openZarr(
        'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store1b.zarr',
        variable
      )
      const injectionDate =
        Object.values(injectionSeason).findIndex((value) => value) + 1
      const injectionChunkIndex = injectionDate - 1
      const raw = await getChunk(getter, [0, injectionChunkIndex, 0])
      const timeSeriesData = getTimeSeriesData(raw, [0, 1], startYear)
      setTimeData(timeSeriesData)
    }
    fetchTimeSeriesData('OAE_efficiency')
  }, [injectionSeason])

  const clippedTimeData = useMemo(() => {
    return timeData.map((line) => line.filter((d) => d[0] <= endYear))
  }, [timeData, endYear])

  return (
    <Box sx={{ zIndex: 0, position: 'relative' }}>
      <Box sx={sx.heading}>efficiency</Box>
      <Box sx={{ width: '100%', height: '300px' }}>
        <Chart
          x={[startYear, endYear]}
          y={[0, 1]}
          padding={{ left: 60, top: 50 }}
        >
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
          <AxisLabel sx={{ fontSize: 0 }} bottom>
            Time
          </AxisLabel>
          <Plot>
            {clippedTimeData.map((line, i) => (
              <Line
                key={i}
                onClick={() => setSelectedRegion(i)}
                onMouseOver={() => setHoveredRegion(i)}
                onMouseLeave={() => setHoveredRegion(null)}
                sx={{
                  stroke: 'blue',
                  strokeWidth: 2,
                  pointerEvents: 'visiblePainted',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                data={line}
              />
            ))}
            {/* bring hovered line to front */}
            {hoveredRegion !== null && timeData[hoveredRegion] && (
              <Line
                key={hoveredRegion}
                onClick={() => setSelectedRegion(hoveredRegion)}
                onMouseOver={() => setHoveredRegion(hoveredRegion)}
                onMouseLeave={() => setHoveredRegion(null)}
                sx={{
                  stroke: 'primary',
                  strokeWidth: 3,
                  pointerEvents: 'visiblePainted',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                data={clippedTimeData[hoveredRegion]}
              />
            )}
          </Plot>
        </Chart>
      </Box>
    </Box>
  )
}

export default TimeseriesOverview
