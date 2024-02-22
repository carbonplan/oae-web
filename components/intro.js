import React from 'react'
import { Box, Divider } from 'theme-ui'
import CWorthyLogo from './cworthy-logo'

const Intro = () => {
  return (
    <>
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
        This is an interactive tool for exploring the efficiency of enhanced
        alkalinity enhancement (OAE). Read the paper or our explainer article
        for more details about the model.
      </Box>
      <Box sx={{ fontSize: 2 }}>Created in collaboration with</Box>
      <CWorthyLogo />
      <Divider sx={{ mt: 4, mb: 5 }} />
    </>
  )
}

export default Intro
