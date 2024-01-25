import React from 'react'
import { Box, Divider, Flex, useThemeUI } from 'theme-ui'
import { useBreakpointIndex } from '@theme-ui/match-media'
import { SidebarFooter } from '@carbonplan/layouts'
import { Badge, Select } from '@carbonplan/components'
import AnimateHeight from 'react-animate-height'
import { X } from '@carbonplan/icons'
import RegionDetail from './region-detail'

const RegionFooter = ({
  hoveredRegion,
  selectedRegion,
  setSelectedRegion,
  elapsedTime,
  setElapsedTime,
  timeHorizon,
  sx,
}) => {
  const { theme } = useThemeUI()
  const breakpointIndex = useBreakpointIndex({ defaultIndex: 2 })
  return (
    <AnimateHeight
      duration={500}
      height={selectedRegion !== null ? 'auto' : 73}
      style={{
        marginLeft: breakpointIndex <= 2 ? '-32px' : '-48px',
        marginRight: breakpointIndex <= 2 ? '-32px' : '-48px',
      }} // hack for footer gutter color stability
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          py: 4,
          px: 5,
          backgroundColor: theme.rawColors?.background,
        }}
      >
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            as={'span'}
            sx={{ textTransform: 'uppercase', fontSize: 3, color: 'secondary' }}
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
                onClick={() => setSelectedRegion(null)}
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
      </Box>
    </AnimateHeight>
  )
}

export default RegionFooter
