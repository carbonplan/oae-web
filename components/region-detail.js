import React from 'react'
import { Box, Divider } from 'theme-ui'
import { Select } from '@carbonplan/components'
import TimeSlider from './time-slider'
import { SidebarDivider } from '@carbonplan/layouts'
import useStore, { variables } from '../store'

const RegionDetail = ({ sx }) => {
  const currentVariable = useStore((state) => state.currentVariable)
  const setCurrentVariable = useStore((state) => state.setCurrentVariable)
  return (
    <>
      <Divider sx={{ mt: 4, mb: 5 }} />
      <Box sx={sx.heading}>Variables</Box>
      <Select
        onChange={(e) => setCurrentVariable(e.target.value)}
        value={currentVariable}
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
        {Object.keys(variables)
          .filter((variable) => variables[variable].detail)
          .map((variable) => (
            <option key={variable} value={variable}>
              {variables[variable].label}
            </option>
          ))}
      </Select>
      <SidebarDivider sx={{ mt: 4, mb: 3 }} />
      <Box sx={{ mb: [-3, -3, -3, -2] }}>
        <TimeSlider />
      </Box>
    </>
  )
}

export default RegionDetail
