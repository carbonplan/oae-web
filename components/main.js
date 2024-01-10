import React, { useState } from 'react'
import { Sidebar, SidebarFooter } from '@carbonplan/layouts'
import { Box, Divider } from 'theme-ui'
import Header from './header'
import MapWrapper from './map'
import RegionFooter from './footer'

const Main = () => {
  const [expanded, setExpanded] = useState(true)
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
          <Sidebar
            expanded={expanded}
            setExpanded={setExpanded}
            side='left'
            width={3}
            footer={<RegionFooter />}
          >
            <Box sx={{ fontSize: 4, fontWeight: 'bold', mb: 2 }}>
              Ocean alkalinity enhancement efficiency
            </Box>
            <Box sx={{ fontSize: 1, mb: 3 }}>
              This is an interactive tool for exploring the efficiency of
              enhanced alkalinity enhancement (OAE). Read the paper or our
              explainer article for more details about the model.
            </Box>
            <Box sx={{ fontSize: 2 }}>Created in collaboration with</Box>
            <Box sx={{ fontSize: 4, mb: 4 }}>[C]Worthy</Box>
            <Divider />
          </Sidebar>
        </MapWrapper>
      </Box>
    </>
  )
}

export default Main
