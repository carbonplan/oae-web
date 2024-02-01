import React from 'react'
import { Box, Divider } from 'theme-ui'
import { Select, Slider } from '@carbonplan/components'

const RegionDetail = ({ sx, elapsedTime, setElapsedTime, timeHorizon }) => {
  return (
    <>
      <Divider sx={{ mt: 4, mb: 5 }} />
      <Box sx={sx.heading}>Variables</Box>
      <Select
        size='xs'
        sx={{
          width: '100%',
          mt: 2,
        }}
        sxSelect={{
          fontFamily: 'mono',
          width: '100%',
          mt: 2,
        }}
      >
        <option>Alkalinity</option>
        <option>something</option>
        <option>something</option>
      </Select>
      <Slider
        sx={{ mt: 4 }}
        value={elapsedTime}
        min={0}
        max={179}
        step={1}
        onChange={(e) => setElapsedTime(parseFloat(e.target.value))}
      />
    </>
  )
}

export default RegionDetail
