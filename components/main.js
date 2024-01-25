import React, { useState } from 'react'
import { Sidebar } from '@carbonplan/layouts'
import { Box, Divider } from 'theme-ui'
import Header from './header'
import MapWrapper from './map'
import RegionFooter from './footer'
import Filters from './filters'
import TimeseriesOverview from './timeseries-overview'
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
  const [expanded, setExpanded] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [timeHorizon, setTimeHorizon] = useState(15)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [injectionSeason, setInjectionSeason] = useState({
    JAN: true,
    APR: false,
    JUL: false,
    OCT: false,
  })
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
        <MapWrapper
          hoveredRegion={hoveredRegion}
          setHoveredRegion={setHoveredRegion}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          elapsedTime={elapsedTime}
        >
          <Sidebar
            expanded={expanded}
            setExpanded={setExpanded}
            side='left'
            width={4}
            footer={
              <RegionFooter
                hoveredRegion={hoveredRegion}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                elapsedTime={elapsedTime}
                setElapsedTime={setElapsedTime}
                timeHorizon={timeHorizon}
                sx={sx}
              />
            }
          >
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
            <Box sx={{ fontSize: 4 }}>[C]Worthy</Box>
            <Divider sx={{ mt: 4, mb: 5 }} />
            <Filters
              sx={sx}
              timeHorizon={timeHorizon}
              setTimeHorizon={setTimeHorizon}
              injectionSeason={injectionSeason}
              setInjectionSeason={setInjectionSeason}
            />
            <Divider sx={{ mt: 4, mb: 5 }} />
            <TimeseriesOverview
              sx={sx}
              setSelectedRegion={setSelectedRegion}
              hoveredRegion={hoveredRegion}
              setHoveredRegion={setHoveredRegion}
              timeHorizon={timeHorizon}
            />
          </Sidebar>
        </MapWrapper>
      </Box>
    </>
  )
}

export default Main
