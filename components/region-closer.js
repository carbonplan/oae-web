import React from 'react'
import { Box, Flex } from 'theme-ui'
import { Badge, Button } from '@carbonplan/components'
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
    <Badge
      sx={{
        position: 'absolute',
        left: ['50%', '50%', badgeLocation(expanded), badgeLocation(expanded)],
        top: ['unset', 'unset', '16px', '15px'],
        bottom: ['135px', '135px', 'unset', 'unset'],
        transform: 'translateX(-50%)',
        px: 1,
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
        }}
      >
        <Box>REGION {String(selectedRegion).padStart(3, '0')}</Box>
        <Button
          onClick={() => setSelectedRegion(null)}
          size='sm'
          sx={{
            ml: 2,
            fontSize: [1, 1, 1, 2],
            borderLeft: '2px solid',
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
        />
      </Flex>
    </Badge>
  )
}

export default RegionCloser
