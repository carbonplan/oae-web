import React from 'react'
import { Box, Flex } from 'theme-ui'
import { Badge, Expander } from '@carbonplan/components'
import AnimateHeight from 'react-animate-height'

import useStore from '../store'
import RegionDetail from './region-detail'

import { useBreakpointIndex } from '@theme-ui/match-media'
import FooterWrapper from './footer-wrapper'

const RegionFooter = ({ sx }) => {
  const hoveredRegion = useStore((state) => state.hoveredRegion)
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)

  const index = useBreakpointIndex({ defaultIndex: 2 })

  const handleClear = () => {
    setSelectedRegion(null)
  }

  return (
    <FooterWrapper bottom={index < 2 ? 64 : 0}>
      <AnimateHeight
        duration={250}
        height={selectedRegion !== null ? 'auto' : 30}
      >
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 30,
          }}
        >
          <Box
            sx={{
              textTransform: 'uppercase',
              fontSize: 3,
              color: 'secondary',
              height: 25,
            }}
          >
            Region
            <Box as={'span'} sx={{ ml: 2, color: 'primary', height: 25 }}>
              {selectedRegion !== null || hoveredRegion !== null ? (
                <Badge>
                  {selectedRegion !== null ? selectedRegion : hoveredRegion}
                </Badge>
              ) : (
                <Box as={'span'}>{' - '}</Box>
              )}
            </Box>
          </Box>
          <Box sx={{ fontSize: [0, 0, 0, 1], color: 'primary' }}>
            {selectedRegion !== null ? (
              <Box
                onClick={handleClear}
                sx={{
                  height: 25,
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
                  height: '100%',
                }}
              >
                Select a model run on the map{index > 1 ? '/graph' : ''}
              </Box>
            )}
          </Box>
        </Flex>
        <RegionDetail sx={sx} />
      </AnimateHeight>
    </FooterWrapper>
  )
}

export default RegionFooter
