import React from 'react'
import { Box, Flex } from 'theme-ui'
import { SidebarFooter } from '@carbonplan/layouts'

const RegionFooter = () => {
  return (
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
            {' - '}
          </Box>
        </Box>
        <Box as={'span'} sx={{ fontSize: 0, color: 'primary' }}>
          Select a model run from the map or graph
        </Box>
      </Flex>
    </SidebarFooter>
  )
}

export default RegionFooter
