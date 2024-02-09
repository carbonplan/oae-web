import React from 'react'
import { ThemeProvider } from 'theme-ui'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'
import HydrationZustand from '../components/hydro-zustand'

const App = ({ Component, pageProps }) => {
  return (
    <HydrationZustand>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </HydrationZustand>
  )
}

export default App
