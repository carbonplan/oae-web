import React from 'react'
import { Box } from 'theme-ui'
import { SidebarDivider } from '@carbonplan/layouts'
import { Column, Link, Logo, Row } from '@carbonplan/components'

import { CarbonToSea, CWorthy, EDF } from './logos'

const About = ({ sx }) => {
  return (
    <>
      <SidebarDivider sx={{ mt: 5, mb: 4 }} />
      <Box sx={sx.heading}>About</Box>

      <Box sx={{ ...sx.description, mb: 3 }}>
        <p>
          [C]Worthy and collaborators{' '}
          <Link href='https://doi.org/10.21203/rs.3.rs-4124909/v1'>
            developed
          </Link>{' '}
          the underlying OAE efficiency dataset. Together, CarbonPlan and
          [C]Worthy built the interactive tool, with funding from the Carbon to
          Sea Initiative and Environmental Defense Fund.
        </p>
      </Box>
      <Row columns={[6, 8, 4, 4]} sx={{ mt: 5 }}>
        <Column start={1} width={[3, 4, 2, 2]}>
          <CWorthy sx={{ width: '75%', maxWidth: '200px' }} />
        </Column>
        <Column start={[4, 5, 3, 3]} width={[3, 4, 2, 2]}>
          <CarbonToSea sx={{ mt: 1, width: '80%', maxWidth: '200px' }} />
        </Column>
        <Column start={1} width={[3, 4, 2, 2]}>
          <EDF sx={{ mt: 4, width: '80%', maxWidth: '200px' }} />
        </Column>
        <Column start={[4, 5, 3, 3]} width={[3, 4, 2, 2]}>
          <Logo sx={{ mt: 4, width: '80%', maxWidth: '200px' }} />
        </Column>
      </Row>
    </>
  )
}

export default About
