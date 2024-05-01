import React, { useEffect, useRef } from 'react'
import useStore from '../store'
import { Sidebar, SidebarAttachment } from '@carbonplan/layouts'
import { Box, Divider, Spinner } from 'theme-ui'
import { useBreakpointIndex } from '@theme-ui/match-media'
import Header from './header'
import MapWrapper from './map'
import RegionFooter from './footer'
import Filters from './filters'
import OverviewChart from './overview-chart'
import MobileSettings from './mobile-settings'
import Intro from './intro'
import TimeSlider from './time-slider'

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
  },
}

const Main = () => {
  const loading = useStore((state) => state.loading)
  const expanded = useStore((state) => state.expanded)
  const setExpanded = useStore((state) => state.setExpanded)
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setShowRegionPicker = useStore((state) => state.setShowRegionPicker)
  const index = useBreakpointIndex({ defaultIndex: 2 })

  // toggle sidebar based on breakpoint
  const prevIndexRef = useRef(index)
  useEffect(() => {
    // ref prevents toggling between mobile sizes
    const prevIndex = prevIndexRef.current
    prevIndexRef.current = index
    if (prevIndex < 2 && index >= 2) {
      setExpanded(true)
    } else if (prevIndex >= 2 && index < 2) {
      setExpanded(false)
      setShowRegionPicker(false)
    }
  }, [index])

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
            <>
              <Sidebar
                expanded={expanded}
                setExpanded={setExpanded}
                side='left'
                width={4}
                footer={
                  <>
                    <RegionFooter sx={sx} />
                    <TimeSlider />
                  </>
                }
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
              {loading && (
                <SidebarAttachment
                  expanded={expanded}
                  side='left'
                  width={4}
                  sx={{
                    top: '16px',
                  }}
                >
                  <Spinner size={32} />
                </SidebarAttachment>
              )}
            </>
          ) : (
            <>
              {loading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '72px',
                    left: '16px',
                    zIndex: 20220,
                  }}
                >
                  <Spinner size={32} />
                </Box>
              )}
              <MobileSettings expanded={expanded}>
                <Intro />
                <Filters sx={sx} />
                <Divider sx={{ mt: 4, mb: 5 }} />
                <OverviewChart sx={sx} />
              </MobileSettings>
              <RegionFooter sx={sx} />
              <TimeSlider />
            </>
          )}
        </MapWrapper>
      </Box>
    </>
  )
}

export default Main
