import React from 'react'
import { Box, Divider, Flex } from 'theme-ui'
import { SidebarFooter } from '@carbonplan/layouts'
import { Badge } from '@carbonplan/components'
import AnimateHeight from 'react-animate-height'
import { X } from '@carbonplan/icons'

const RegionFooter = ({
  hoveredRegion,
  selectedRegion,
  setSelectedRegion,
  sx,
}) => {
  return (
    <AnimateHeight
      duration={500}
      height={selectedRegion !== null ? 'auto' : 73}
    >
      <SidebarFooter sx={{ pt: 4, pb: 4 }}>
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
        {/* {selectedRegion !== null && ( */}
        <>
          <Divider sx={{ mt: 4, mb: 5 }} />
          <Box sx={sx.heading}>Variables</Box>
        </>
        {/* )} */}
      </SidebarFooter>
    </AnimateHeight>
  )
}

export default RegionFooter
