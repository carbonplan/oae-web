import React from 'react'
import { Box, Divider } from 'theme-ui'
import { Select } from '@carbonplan/components'
import TimeSlider from './time-slider'
import { SidebarDivider } from '@carbonplan/layouts'
import useStore, { variables } from '../store'

const RegionDetail = ({ sx }) => {
  const currentVariable = useStore((state) => state.currentVariable)
  const setCurrentVariable = useStore((state) => state.setCurrentVariable)

  const handleSelection = (e) => {
    const selectedVariable = variables.find(
      (variable) => variable.key === e.target.value
    )
    setCurrentVariable(selectedVariable)
  }

  return (
    <>
      <Divider sx={{ mt: 4, mb: 5 }} />
      <Box sx={sx.heading}>Variables</Box>
      <Select
        onChange={handleSelection}
        value={currentVariable.key}
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
        {variables.map((variable) => (
          <option key={variable.key} value={variable.key}>
            {variable.label}
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
