import React from 'react'
import { Box, Container } from 'theme-ui'
import {
  Meta,
  Guide,
  Dimmer,
  Header as HeaderComponent,
  Settings,
} from '@carbonplan/components'

const Header = ({ expanded, setExpanded }) => {
  return (
    <>
      <Meta
        card={'https://images.carbonplan.org/social/oae-efficiency.png'}
        description={
          'Interactive mapping tool for exploring the efficiency of ocean alkalinity enhancement (OAE).'
        }
        title={'OAE Efficiency – CarbonPlan'}
      />

      <Container>
        <Guide color='teal' />
      </Container>

      <Box
        sx={{
          width: '100%',
          borderWidth: 0,
          borderStyle: ['solid', 'solid', 'none', 'none'],
          borderColor: ['muted', 'muted', 'unset', 'unset'],
          borderBottomWidth: ['1px', '1px', 'unset', 'unset'],
          bg: ['background', 'background', 'unset', 'unset'],
          position: 'sticky',
          top: 0,
          height: '56px',
          zIndex: 5000,
          pointerEvents: 'none',
        }}
      >
        <Container>
          <HeaderComponent
            menuItems={[
              <Dimmer key='dimmer' sx={{ mt: '-2px', color: 'primary' }} />,
              <Settings
                key='settings'
                sx={{
                  mr: ['2px'],
                  display: ['inherit', 'inherit', 'none', 'none'],
                }}
                value={expanded}
                onClick={() => setExpanded(!expanded)}
              />,
            ]}
          />
        </Container>
      </Box>
    </>
  )
}

export default Header
