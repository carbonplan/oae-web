import React from 'react'
import { Box, Flex } from 'theme-ui'
import { Badge, Expander } from '@carbonplan/components'
import { alpha } from '@theme-ui/color'
import AnimateHeight from 'react-animate-height'

import useStore from '../store'
import RegionDetail from './region-detail'

import { useBreakpointIndex } from '@theme-ui/match-media'
import { SidebarDivider } from '@carbonplan/layouts'

const RegionInfo = ({ sx }) => {
  const hoveredRegion = useStore((state) => state.hoveredRegion)
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)

  const index = useBreakpointIndex({ defaultIndex: 2 })

  const handleClear = () => {
    setSelectedRegion(null)
  }

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: -25,
          background: 'background',
          cursor: 'pointer',
          transition: 'background-color 0.15s',
          zIndex: 1,
          mx: [-4, -5, -5, -6],
          px: [4, 5, 5, 6],
          '&:hover': {
            background: alpha('muted', 0.25),
          },
          '&:hover #guide': {
            color: 'primary',
          },
          '&:hover #expander': {
            stroke: 'primary',
          },
        }}
        onClick={selectedRegion ? handleClear : null}
      >
        <SidebarDivider sx={{ mb: 0 }} />

        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'primary',
            py: 3,
          }}
        >
          <Flex sx={{ gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ ...sx.heading }}>Region</Box>
            {selectedRegion !== null || hoveredRegion !== null ? (
              <Badge sx={{ mt: '-1px' }}>
                {String(selectedRegion ?? hoveredRegion).padStart(3, '0')}
              </Badge>
            ) : (
              <Box as={'span'}>{' - '}</Box>
            )}
          </Flex>
          <Box sx={{ fontSize: [0, 0, 0, 1], color: 'primary' }}>
            {selectedRegion !== null ? (
              <Flex sx={{ alignItems: 'center' }}>
                <Box
                  id='guide'
                  sx={{
                    transition: 'color .2s',
                    color: 'secondary',
                    overflowX: 'visible',
                    wordWrap: 'normal',
                  }}
                >
                  Clear
                </Box>
                <Expander
                  id='expander'
                  value={true}
                  sx={{
                    width: 24,
                    ml: 1,
                  }}
                  onClick={handleClear}
                />
              </Flex>
            ) : (
              <Box
                id='guide'
                sx={{
                  transition: 'color .2s',
                  color: 'secondary',
                  overflowX: 'visible',
                  wordWrap: 'normal',
                  mt: -1,
                }}
              >
                Select a model run on the map{index > 1 ? '/graph' : ''}
              </Box>
            )}
          </Box>
        </Flex>
        <SidebarDivider sx={{ mt: 0, mb: 4 }} />
      </Box>

      <AnimateHeight
        duration={250}
        height={selectedRegion !== null ? 'auto' : 0}
      >
        {selectedRegion !== null && <RegionDetail sx={sx} />}
        {selectedRegion !== null && <SidebarDivider sx={{ mt: 0, mb: 4 }} />}
      </AnimateHeight>
    </>
  )
}

export default RegionInfo
