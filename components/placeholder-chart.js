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
          letterSpacing: 'mono',
          fontSize: [0, 0, 0, 1],
          color: 'hinted',
        }}
      >
        (0, 0)
      </Box>
      <Chart x={[0, 15]} y={[0, 1]} padding={{ top: 30 }} sx={{ mt: 10 }}>
        <Grid horizontal vertical sx={{ borderColor: 'hinted' }} />
        <AxisLabel
          sx={{ fontSize: [0, 0, 0, 1], color: 'hinted' }}
          left
          arrow={false}
        >
          Variable
        </AxisLabel>
        <AxisLabel
          arrow={false}
          sx={{ fontSize: [0, 0, 0, 1], color: 'hinted' }}
          bottom
        >
          Time
        </AxisLabel>
        <TickLabels
          sx={{ color: 'hinted' }}
          left
          format={(d) => {
            if (Math.abs(d) < 0.001 && d !== 0) {
              return d.toExponential(0)
            }
            return d
          }}
        />
        <TickLabels sx={{ color: 'hinted' }} bottom values={[0, 5, 10, 15]} />
      </Chart>
      <Box
        sx={{
          position: 'absolute',
          top: '46.5%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: [210, 210, 210, 250],
          fontSize: [1, 1, 1, 2],
          color: 'secondary',
        }}
      >
        Click on the search icon above to generate a time series
      </Box>
    </Box>
  )
}

export default PlaceholderChart
