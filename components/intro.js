import React from 'react'
import { Box } from 'theme-ui'
import { Link } from '@carbonplan/components'

const Intro = () => {
  return (
    <Box sx={{ fontSize: 1, mb: 3 }}>
      This is an interactive tool for exploring the efficiency of ocean
      alkalinity enhancement (OAE). You can explore global patterns, or drill
      down to see how alkalinity released in a specific region and season will
      move through the ocean and result in carbon removal over time. Read the{' '}
      <Link href='https://doi.org/10.21203/rs.3.rs-4124909/v1'>preprint</Link>{' '}
      or our <Link href='TK'>explainer article</Link> for more details.
      Developed in collaboration with{' '}
      <Link href='https://cworthy.org/'>[C]Worthy</Link>.
    </Box>
  )
}

export default Intro
