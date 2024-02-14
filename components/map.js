import React, { useMemo } from 'react'
import { Box, useThemeUI } from 'theme-ui'
import { Map, Line, Raster } from '@carbonplan/maps'
import { Colorbar } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'

import useStore from '../store'
import Regions from './regions'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'

const MapWrapper = ({ children, setLoading }) => {
  const selectedRegion = useStore((state) => state.selectedRegion)
  const elapsedTime = useStore((state) => state.elapsedTime)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const currentVariable = useStore((state) => state.currentVariable)

  const colormap = useThemedColormap(currentVariable.colormap)

  const { theme } = useThemeUI()

  const injectionDate = useMemo(() => {
    return Object.values(injectionSeason).findIndex((value) => value) + 1
  }, [injectionSeason])

  return (
    <Map zoom={0} center={[0, 0]} debug={false} setLoading={setLoading}>
      <Line
        color={theme.rawColors.secondary}
        source={bucket + 'basemaps/land'}
        variable={'land'}
      />
      {selectedRegion !== null ? (
        <Raster
          key={currentVariable.key}
          source={
            'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store2.zarr'
          }
          colormap={colormap}
          clim={currentVariable.colorLimits}
          mode={'texture'}
          variable={currentVariable.key}
          selector={{
            polygon_id: selectedRegion,
            elapsed_time: elapsedTime,
            injection_date: injectionDate,
          }}
        />
      ) : (
        <Regions />
      )}
      {children}
      <Box sx={{ position: 'absolute', bottom: 3, right: 3 }}>
        <Colorbar
          colormap={colormap}
          clim={currentVariable.colorLimits}
          label={currentVariable.label}
          units={currentVariable.unit}
          horizontal
        />
      </Box>
    </Map>
  )
}

export default MapWrapper
