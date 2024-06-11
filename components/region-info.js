import React from 'react'
import { Box, Flex } from 'theme-ui'
import { Badge, Expander } from '@carbonplan/components'
import { mix } from '@theme-ui/color'
import { SidebarDivider } from '@carbonplan/layouts'

import useStore from '../store'

const RegionInfo = ({ sx }) => {
  const hoveredRegion = useStore((state) => state.hoveredRegion)
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)

  const hasSelectedRegion = selectedRegion !== null

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
            background: mix('muted', 'background', 0.25),
          },
          '&:hover #guide': {
            color: 'primary',
          },
          '&:hover #expander': {
            stroke: 'primary',
          },
        }}
        onClick={hasSelectedRegion ? handleClear : null}
      >
        <SidebarDivider sx={{ mb: 0 }} />

        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'primary',
            pt: 3,
            pb: '9px',
          }}
        >
          <Flex sx={{ gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ ...sx.heading }}>Region</Box>
            <Badge sx={{ mt: '-1px' }}>
              {String(
                (selectedRegion ?? hoveredRegion) !== null
                  ? selectedRegion ?? hoveredRegion
                  : '---'
              ).padStart(3, '0')}
            </Badge>
          </Flex>
          <Box sx={{ fontSize: [0, 0, 0, 1], color: 'primary' }}>
            {hasSelectedRegion ? (
              <Flex sx={{ alignItems: 'center' }}>
                <Box
                  id='guide'
                  sx={{
                    transition: 'color .2s',
                    color: 'secondary',
                    overflowX: 'visible',
                    wordWrap: 'normal',
                    mt: '-5px',
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
                    mt: '-5px',
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
                  mt: '-5px',
                }}
              >
                Select a polygon on the map
              </Box>
            )}
          </Box>
        </Flex>
        <SidebarDivider sx={{ mt: 0, mb: 4 }} />
      </Box>
    </>
  )
}

export default RegionInfo
