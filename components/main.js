import React, { useEffect, useRef } from 'react'
import { Sidebar, SidebarAttachment, SidebarDivider } from '@carbonplan/layouts'
import { Box, Spinner } from 'theme-ui'
import { useBreakpointIndex } from '@theme-ui/match-media'

import useStore from '../store'
import Header from './header'
import MapWrapper from './map'
import Footer from './footer'
import OverviewChart from './overview-chart'
import MobileSettings from './mobile-settings'
import Intro from './intro'
import RegionInfo from './region-info'

const sx = {
  heading: {
    fontFamily: 'heading',
    letterSpacing: 'smallcaps',
    textTransform: 'uppercase',
    fontSize: [2, 2, 2, 3],
    mb: [2],
  },
  subHeading: {
    fontFamily: 'faux',
    letterSpacing: 'faux',
    fontSize: [2, 2, 2, 3],
    mb: [2],
  },
  label: {
    fontFamily: 'mono',
    letterSpacing: 'mono',
    textTransform: 'uppercase',
    color: 'secondary',
    fontSize: [1],
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: [1, 1, 1, 2],
  },
}

const Main = () => {
  const loading = useStore((state) => state.loading)
  const selectedRegion = useStore((state) => state.selectedRegion)
  const expanded = useStore((state) => state.expanded)
  const setExpanded = useStore((state) => state.setExpanded)
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

  useEffect(() => {
    if (index < 2 && selectedRegion) {
      setExpanded(true)
    }
  }, [index, selectedRegion])

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
                footer={<Footer />}
              >
                <>
                  <Intro />
                  <RegionInfo sx={sx} />
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
                <RegionInfo sx={sx} />
                <OverviewChart sx={sx} />
              </MobileSettings>
              <Footer />
            </>
          )}
        </MapWrapper>
      </Box>
    </>
  )
}

export default Main
