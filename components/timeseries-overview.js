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
      <Box sx={{ width: '100%', height: '400px' }}>
        <Chart x={[1999, 2014]} y={[0, 1]} padding={{ left: 60, top: 50 }}>
          <Grid vertical horizontal />
          <Ticks left bottom />
          <TickLabels left bottom />
          <AxisLabel left>OAE efficiency</AxisLabel>
          <AxisLabel bottom>Time</AxisLabel>
          <Plot>
            <Line
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
    </>
  )
}

export default TimeseriesOverview
