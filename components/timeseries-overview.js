import React from 'react'
import { Box } from 'theme-ui'
import {
  AxisLabel,
  Chart,
  Grid,
  Line,
  Plot,
  TickLabels,
  Ticks,
} from '@carbonplan/charts'

function TimeseriesOverview({ sx }) {
  return (
    <>
      <Box sx={sx.heading}>efficiency</Box>
      <Box sx={sx.label}>Download CSV</Box>
      <Box sx={{ width: '100%', height: '400px' }}>
        <Chart x={[1999, 2014]} y={[0, 1]} padding={{ left: 60, top: 50 }}>
          <Grid vertical horizontal />

          <Ticks left bottom />
          <TickLabels left bottom />
          <AxisLabel left>OAE efficiency</AxisLabel>
          <AxisLabel bottom>Time</AxisLabel>
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
