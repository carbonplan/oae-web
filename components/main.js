import React from 'react'
import useStore from '../store'
import { Sidebar } from '@carbonplan/layouts'
import { Box, Divider } from 'theme-ui'
import { useBreakpointIndex } from '@theme-ui/match-media'
import Header from './header'
import MapWrapper from './map'
import RegionFooter from './footer'
import Filters from './filters'
import CWorthyLogo from './cworthy-logo'
import OverviewChart from './overview-chart'

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
  const index = useBreakpointIndex({ defaultIndex: 2 })

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
                <Box
                  sx={{
                    fontSize: 4,
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  Ocean alkalinity enhancement efficiency
                </Box>
                <Box sx={{ fontSize: 1, mb: 3 }}>
                  This is an interactive tool for exploring the efficiency of
                  enhanced alkalinity enhancement (OAE). Read the paper or our
                  explainer article for more details about the model.
                </Box>
                <Box sx={{ fontSize: 2 }}>Created in collaboration with</Box>
                <CWorthyLogo />
                <Divider sx={{ mt: 4, mb: 5 }} />
                <Filters sx={sx} />
                <Divider sx={{ mt: 4, mb: 5 }} />
                <OverviewChart sx={sx} />
              </>
            </Sidebar>
          ) : (
            <RegionFooter sx={sx} />
          )}
        </MapWrapper>
      </Box>
    </>
  )
}

export default Main
