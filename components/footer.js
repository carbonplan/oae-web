import React from 'react'
import useStore from '../store'
import { Box, Flex } from 'theme-ui'
import { Badge } from '@carbonplan/components'
import { SidebarFooter } from '@carbonplan/layouts'
import AnimateHeight from 'react-animate-height'
import { X } from '@carbonplan/icons'
import RegionDetail from './region-detail'

const RegionFooter = ({ sx }) => {
  const {
    hoveredRegion,
    setHoveredRegion,
    selectedRegion,
    setSelectedRegion,
    elapsedTime,
    setElapsedTime,
    timeHorizon,
  } = useStore()

  const handleClear = () => {
    setSelectedRegion(null)
    setHoveredRegion(null)
  }

  return (
    <SidebarFooter
      sx={{
        position: 'relative',
        zIndex: 2,
        bg: 'background',
        '&:hover': { bg: 'background' },
      }}
    >
      <AnimateHeight
        duration={500}
        height={selectedRegion !== null ? 'auto' : 25}
      >
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            as={'span'}
            sx={{
              textTransform: 'uppercase',
              fontSize: 3,
              color: 'secondary',
            }}
          >
            <Box as={'span'}>Region</Box>
            <Box as={'span'} sx={{ ml: 2, color: 'primary' }}>
              {selectedRegion !== null || hoveredRegion !== null ? (
                <Badge>
                  {selectedRegion !== null ? selectedRegion : hoveredRegion}
                </Badge>
              ) : (
                <Box as={'span'}>{' - '}</Box>
              )}
            </Box>
          </Box>
          <Box as={'span'} sx={{ fontSize: 0, color: 'primary' }}>
            {selectedRegion !== null ? (
              <Box
                onClick={handleClear}
                as={'span'}
                sx={{
                  textTransform: 'uppercase',
                  fontSize: 3,
                  '&:hover #clear, &:hover': {
                    cursor: 'pointer',
                    color: 'primary',
                  },
                }}
              >
                Clear
                <X
                  id={'clear'}
                  sx={{
                    height: 12,
                    color: 'secondary',
                    cursor: 'pointer',
                  }}
                />
              </Box>
            ) : (
              <Box as={'span'} sx={{ color: 'primary' }}>
                Select a model run from the map or graph
              </Box>
            )}
          </Box>
        </Flex>
        <RegionDetail
          sx={sx}
          elapsedTime={elapsedTime}
          timeHorizon={timeHorizon}
          setElapsedTime={setElapsedTime}
        />
      </AnimateHeight>
    </SidebarFooter>
  )
}

export default RegionFooter
