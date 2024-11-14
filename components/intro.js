import React from 'react'
import { Box } from 'theme-ui'
import { Link } from '@carbonplan/components'

const Intro = ({ sx }) => {
  return (
    <Box sx={{ ...sx.description, mb: 3 }}>
      This is an interactive tool for exploring the efficiency of ocean
      alkalinity enhancement (OAE). You can explore global patterns, or select a
      polygon region to see how alkalinity released in a specific region and
      month will move through the ocean and result in carbon removal over time.
      Read the{' '}
      <Link href='https://www.nature.com/articles/s41558-024-02179-9.epdf?sharing_token=LgDF4VdJvkifRzIuQy5nT9RgN0jAjWel9jnR3ZoTv0ML06qtsGAXcI3ncw2VKMdvNBF8yc3ykUNvQP2YZSZZg3VEb8eJNbnayufBxkZ0cVTHRB4myOJv4osBgWv1OPyMNfRCLYPLT3MancsjfEhCqWMLGD_VUA_LXbALrR9640c%3D'>
        paper
      </Link>{' '}
      or our{' '}
      <Link href='https://carbonplan.org/research/oae-efficiency-explainer'>
        explainer article
      </Link>{' '}
      for more details. Developed in collaboration with{' '}
      <Link href='https://cworthy.org/'>[C]Worthy</Link>.
    </Box>
  )
}

export default Intro
