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

function TimeseriesOverview({ sx }) {
  return (
    <>
      <Box sx={sx.heading}>efficiency</Box>
      <Box sx={{ width: '100%', height: '300px' }}>
        <Chart x={[1999, 2014]} y={[0, 1]} padding={{ left: 60, top: 50 }}>
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
              sx={{
                stroke: 'blue',
                '&:hover': { stroke: 'red', cursor: 'pointer' },
              }}
              data={[
                [2014, 0.9],
                [2004, 0.75],
                [2002, 0.5],
                [1999, 0],
              ]}
            />
            <Line
              sx={{
                stroke: 'blue',
                '&:hover': { stroke: 'red', cursor: 'pointer' },
              }}
              data={[
                [2014, 0.93],
                [2004, 0.72],
                [2002, 0.45],
                [1999, 0],
              ]}
            />
          </Plot>
        </Chart>
      </Box>
    </>
  )
}

export default TimeseriesOverview
