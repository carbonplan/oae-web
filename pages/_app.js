import React from 'react'
import { ThemeUIProvider } from 'theme-ui'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import theme from '@carbonplan/theme'
import { ScrollProvider } from '../components/scroll-context'

const App = ({ Component, pageProps }) => {
  return (
    <ThemeUIProvider theme={theme}>
      <ScrollProvider>
        <Component {...pageProps} />
      </ScrollProvider>
    </ThemeUIProvider>
  )
}

export default App
