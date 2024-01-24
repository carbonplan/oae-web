import React from 'react'
import { Box, Divider } from 'theme-ui'
import { Select } from '@carbonplan/components'

const RegionDetail = ({ sx }) => {
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
    </>
  )
}

export default RegionDetail
