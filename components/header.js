import React from 'react'
import { Box, Container } from 'theme-ui'
import {
  Meta,
  Guide,
  Dimmer,
  Header as HeaderComponent,
  Settings,
} from '@carbonplan/components'
import useStore from '../store'

const Header = () => {
  const expanded = useStore((state) => state.expanded)
  const setExpanded = useStore((state) => state.setExpanded)
  return (
    <>
      <Meta card={''} description={'OAE Web'} title={'OAE'} />

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
                onClick={() => setExpanded((prev) => !prev)}
              />,
            ]}
          />
        </Container>
      </Box>
    </>
  )
}

export default Header
