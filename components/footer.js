import React from 'react'
import { Box, Flex } from 'theme-ui'
import { Badge, Expander } from '@carbonplan/components'
import { SidebarFooter } from '@carbonplan/layouts'
import AnimateHeight from 'react-animate-height'

import useStore from '../store'
import RegionDetail from './region-detail'
import { useBreakpointIndex } from '@theme-ui/match-media'

const RegionFooter = ({ sx }) => {
  const hoveredRegion = useStore((state) => state.hoveredRegion)
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)

  const index = useBreakpointIndex({ defaultIndex: 2 })

  const handleClear = () => {
    setSelectedRegion(null)
  }

  const getMobileMarginFix = () => {
    // !important breaks things when using standard array syntax
    if (index <= 1) {
      return '0 !important'
    } else {
      return 0
    }
  }

  return (
    <SidebarFooter
      sx={{
        position: ['absolute', 'absolute', 'relative', 'relative'],
        bottom: 0,
        width: ['100%', '100%', 'auto', 'auto'],
        mr: getMobileMarginFix(),
        ml: getMobileMarginFix(),
        zIndex: 2,
        bg: 'background',
        '&:hover': { bg: 'background' },
        cursor: 'auto',
        borderTop: [
          '0.5px solid #393a3d',
          '0.5px solid #393a3d',
          'none',
          'none',
        ],
      }}
    >
      <AnimateHeight
        duration={250}
        height={selectedRegion !== null ? 'auto' : 25}
      >
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
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
          <Box sx={{ fontSize: 0, color: 'primary' }}>
            {selectedRegion !== null ? (
              <Box
                onClick={handleClear}
                sx={{
                  textTransform: 'uppercase',
                  fontSize: 3,
                  cursor: 'pointer',
                  '&:hover #clear': {
                    stroke: 'primary',
                  },
                }}
              >
                Clear
                <Expander id='clear' value={true} sx={{ width: 20, ml: 1 }} />
              </Box>
            ) : (
              <Box
                sx={{
                  color: 'primary',
                  overflowX: 'visible',
                  wordWrap: 'normal',
                }}
              >
                Select a model run on the map{index > 1 ? '/graph' : ''}
              </Box>
            )}
          </Box>
        </Flex>
        <RegionDetail sx={sx} />
      </AnimateHeight>
    </SidebarFooter>
  )
}

export default RegionFooter
