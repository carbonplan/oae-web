import React, { useEffect } from 'react'
import useStore from '../store'
import { Sidebar } from '@carbonplan/layouts'
import { Box, Divider } from 'theme-ui'
import { useBreakpointIndex } from '@theme-ui/match-media'
import Header from './header'
import MapWrapper from './map'
import RegionFooter from './footer'
import Filters from './filters'
import OverviewChart from './overview-chart'
import MobileSettings from './mobile-settings'
import Intro from './intro'

const sx = {
  heading: {
    fontFamily: 'heading',
    letterSpacing: 'smallcaps',
    textTransform: 'uppercase',
    fontSize: [2, 2, 2, 3],
    mb: [2],
  },
  description: {
    fontSize: [1, 1, 1, 2],
  },
  label: {
    color: 'secondary',
    fontFamily: 'mono',
    letterSpacing: 'mono',
    fontSize: [1, 1, 1, 2],
    textTransform: 'uppercase',
    my: 2,
  },
}

const Main = () => {
  const expanded = useStore((state) => state.expanded)
  const setExpanded = useStore((state) => state.setExpanded)
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setShowRegionPicker = useStore((state) => state.setShowRegionPicker)
  const index = useBreakpointIndex({ defaultIndex: 2 })

  // toggle sidebar based on breakpoint
  useEffect(() => {
    if (index < 2) {
      setExpanded(false)
      setShowRegionPicker(false)
    } else {
      setExpanded(true)
    }
  }, [index, setExpanded])

  return (
    <>
      <Header expanded={expanded} setExpanded={setExpanded} />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '100%',
        }}
      >
        <MapWrapper>
          {index >= 2 ? (
            <Sidebar
              expanded={expanded}
              setExpanded={setExpanded}
              side='left'
              width={4}
              footer={<RegionFooter sx={sx} />}
            >
              <>
                <Box
                  sx={{
                    // overlay
                    width: '100%',
                    height: '100%',
                    backgroundColor:
                      selectedRegion !== null
                        ? 'rgba(0,0,0,0.65)'
                        : 'rgba(0,0,0,0)',
                    pointerEvents: selectedRegion !== null ? 'auto' : 'none',
                    transition: 'background-color 0.5s ease',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 1,
                  }}
                />
                <Intro />
                <Filters sx={sx} />
                <Divider sx={{ mt: 4, mb: 5 }} />
                <OverviewChart sx={sx} />
              </>
            </Sidebar>
          ) : (
            <>
              <MobileSettings expanded={expanded}>
                <Intro />
                <Filters sx={sx} />
                <Divider sx={{ mt: 4, mb: 5 }} />
                <OverviewChart sx={sx} />
              </MobileSettings>
              <RegionFooter sx={sx} />
            </>
          )}
        </MapWrapper>
      </Box>
    </>
  )
}

export default Main
