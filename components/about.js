import React from 'react'
import { Box } from 'theme-ui'
import { SidebarDivider } from '@carbonplan/layouts'
import { Column, Logo, Row } from '@carbonplan/components'

import { CarbonToSea, CWorthy } from './logos'

const About = ({ sx }) => {
  return (
    <>
      <SidebarDivider sx={{ my: 4 }} />
      <Box sx={sx.heading}>About</Box>

      <Box sx={{ fontSize: 1, mb: 3 }}>
        <p>
          This is interactive tool explores the efficiency of enhanced
          alkalinity enhancement (OAE). It was built by [C]Worthy and
          CarbonPlan, with funding from the Carbon to Sea Initiative.
        </p>
        <p>TK</p>
      </Box>
      <Row columns={[6, 8, 4, 4]} sx={{ mt: 5 }}>
        <Column start={1} width={[3, 4, 2, 2]}>
          <CWorthy sx={{ width: '90%', maxWidth: '200px' }} />
        </Column>
        <Column start={[4, 5, 3, 3]} width={[3, 4, 2, 2]}>
          <CarbonToSea sx={{ width: '100%', maxWidth: '200px' }} />
        </Column>
        <Column start={1} width={[3, 4, 2, 2]}>
          <Logo sx={{ mt: 3, width: '100%', maxWidth: '200px' }} />
        </Column>
      </Row>
    </>
  )
}

export default About
