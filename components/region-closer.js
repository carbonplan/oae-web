import React from 'react'
import { Box, Flex } from 'theme-ui'
import { Button } from '@carbonplan/components'
import { X } from '@carbonplan/icons'
import useStore from '../store'

const badgeLocation = (expanded) => {
  if (expanded) {
    return '66%'
  } else {
    return '50%'
  }
}

const RegionCloser = () => {
  const selectedRegion = useStore((s) => s.selectedRegion)
  const setSelectedRegion = useStore((s) => s.setSelectedRegion)
  const expanded = useStore((s) => s.expanded)

  return (
    <Flex
      sx={{
        alignItems: 'center',
        position: 'absolute',
        left: ['50%', '50%', badgeLocation(expanded), badgeLocation(expanded)],
        top: ['unset', 'unset', '12px', '9px'],
        bottom: ['135px', '135px', 'unset', 'unset'],
        transform: 'translate(-50%, 0)',
        background: 'muted',
        fontFamily: 'mono',
        fontSize: [1, 1, 1, 2],
        height: [32, 32, 32, 36],
        py: 2,
        px: 3,
        borderRadius: 40,
      }}
    >
      <Box>REGION {String(selectedRegion).padStart(3, '0')}</Box>
      <Button
        onClick={() => setSelectedRegion(null)}
        size='sm'
        sx={{
          ml: 2,
          fontSize: [1, 1, 1, 2],
          borderLeft: '1px solid',
          borderColor: 'secondary',
        }}
        suffix={
          <X
            sx={{
              ml: 2,
              height: 16,
            }}
          />
        }
      ></Button>
    </Flex>
  )
}

export default RegionCloser
