import React, { useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { IconButton, Box, Flex } from 'theme-ui'
import { Info } from '@carbonplan/icons'

const Tooltip = ({ expanded, setExpanded, sx }) => {
  return (
    <IconButton
      onClick={() => setExpanded(!expanded)}
      role='checkbox'
      aria-checked={expanded}
      aria-label='Information'
      sx={{
        cursor: 'pointer',
        height: '16px',
        width: '16px',
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover > #info': {
            stroke: 'primary',
          },
        },
        p: [0],
        ...sx,
      }}
    >
      <Info
        id='info'
        height='16px'
        width='16px'
        sx={{
          stroke: expanded ? 'primary' : 'secondary',
          transition: '0.1s',
        }}
      />
    </IconButton>
  )
}

const TooltipWrapper = ({
  children,
  tooltip,
  mt = 0,
  color = 'primary',
  sx,
}) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          ...sx,
        }}
      >
        {children}
        <Tooltip
          expanded={expanded}
          setExpanded={setExpanded}
          sx={{ mt: mt, flexShrink: 0 }}
        />
      </Flex>
      <AnimateHeight
        duration={100}
        height={expanded ? 'auto' : 0}
        easing={'linear'}
      >
        <Box sx={{ my: 1, fontSize: [1, 1, 1, 2], color }}>{tooltip}</Box>
      </AnimateHeight>
    </>
  )
}

export default TooltipWrapper
