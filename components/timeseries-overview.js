import React from 'react'
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

const TimeseriesOverview = ({
  sx,
  setSelectedRegion,
  hoveredRegion,
  setHoveredRegion,
  timeHorizon,
}) => {
  return (
    <Box sx={{ zIndex: 0, position: 'relative' }}>
      <Box sx={sx.heading}>efficiency</Box>
      <Box sx={{ width: '100%', height: '300px' }}>
        <Chart
          x={[1999, 1999 + timeHorizon]}
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
            <Line
              onClick={(e) => setSelectedRegion(0)}
              onMouseOver={(e) => setHoveredRegion(0)}
              onMouseOut={(e) => setHoveredRegion(null)}
              id='line0'
              sx={{
                stroke: hoveredRegion === 0 ? 'red' : 'blue',
                strokeWidth: 2,
                pointerEvents: 'visiblePainted',
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
              data={[
                [2014, 0.9],
                [2004, 0.75],
                [2002, 0.5],
                [1999, 0],
              ]}
            />
          </Plot>
        </Chart>
      </Box>
    </Box>
  )
}

export default TimeseriesOverview
