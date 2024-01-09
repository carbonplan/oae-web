import React from 'react'
import { useThemeUI } from 'theme-ui'
import { Fill, Map, Line } from '@carbonplan/maps'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'

const MapWrapper = ({ children, setLoading }) => {
  const { theme } = useThemeUI()
  return (
    <Map zoom={0} center={[0, 0]} debug={false} setLoading={setLoading}>
      <Fill
        color={theme.rawColors.background}
        source={bucket + 'basemaps/ocean'}
        variable={'ocean'}
      />
      <Line
        color={theme.rawColors.primary}
        source={bucket + 'basemaps/land'}
        variable={'land'}
      />
      {children}
    </Map>
  )
}

export default MapWrapper
