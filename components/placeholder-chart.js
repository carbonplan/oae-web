import React from 'react'
import { Box } from 'theme-ui'
import { AxisLabel, Chart, Grid, TickLabels, Ticks } from '@carbonplan/charts'

const PlaceholderChart = () => {
  return (
    <Box
      sx={{
        zIndex: 0,
        position: 'relative',
        width: '100%',
        height: '300px',
        mt: 19 + 15,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          fontFamily: 'mono',
          fontSize: 1,
          color: 'muted',
          pointerEvents: 'none',
        }}
      >
        (0, 0)
      </Box>
      <Chart x={[0, 15]} y={[0, 1]} padding={{ top: 30 }} sx={{ mt: 10 }}>
        <Grid horizontal vertical sx={{ borderColor: 'hinted' }} />
        <AxisLabel sx={{ fontSize: 0, color: 'muted' }} left arrow={false}>
          Variable
        </AxisLabel>
        <AxisLabel arrow={false} sx={{ fontSize: 0, color: 'muted' }} bottom>
          Time
        </AxisLabel>
        <TickLabels
          sx={{ color: 'muted' }}
          left
          format={(d) => {
            if (Math.abs(d) < 0.001 && d !== 0) {
              return d.toExponential(0)
            }
            return d
          }}
        />
        <TickLabels sx={{ color: 'muted' }} bottom values={[0, 5, 10, 15]} />
      </Chart>
      <Box
        sx={{
          top: '-60%',
          left: '33%',
          position: 'relative',
          maxWidth: '60%',
          fontSize: [0, 0, 0, 1],
          color: 'secondary',
        }}
      >
        Select the search icon above to create
      </Box>
    </Box>
  )
}

export default PlaceholderChart
