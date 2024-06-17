import React, { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { Column, Row } from '@carbonplan/components'

const MobileSettings = ({ expanded, children }) => {
  const [isInitialRender, setIsInitialRender] = useState(true)

  useEffect(() => {
    setIsInitialRender(false)
  }, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        mt: '56px',
        zIndex: 1100,
        borderStyle: 'solid',
        borderColor: 'muted',
        borderWidth: '0px',
        borderBottomWidth: '1px',
        transition: isInitialRender ? 'none' : 'transform 0.15s',
        transform: expanded ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          bg: 'background',
        }}
      >
        <Box
          sx={{
            px: [4, 5, 5, 6],
          }}
        >
          <Row
            sx={{
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 56px)',
              py: [4],
              px: [4, 5, 5, 6],
              mx: [-4, -5, -5, -6],
            }}
          >
            <Column start={[1, 1, 1, 1]} width={[6, 8, 10, 10]}>
              {children}
            </Column>
          </Row>
        </Box>
      </Flex>
    </Box>
  )
}

export default MobileSettings
