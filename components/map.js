import React, { useMemo } from 'react'
import { useThemeUI } from 'theme-ui'
import { Map, Line, Raster } from '@carbonplan/maps'
import Regions from './regions'
import useStore from '../store/store'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'

const MapWrapper = ({ children, setLoading, colormap, colorLimits }) => {
  const { selectedRegion, elapsedTime, injectionSeason } = useStore()
  const { theme } = useThemeUI()
  const injectionDate = useMemo(() => {
    return Object.values(injectionSeason).findIndex((value) => value) + 1
  }, [injectionSeason])

  // switch to usestore zustand

  return (
    <Map zoom={0} center={[0, 0]} debug={false} setLoading={setLoading}>
      <Line
        color={theme.rawColors.secondary}
        source={bucket + 'basemaps/land'}
        variable={'land'}
      />
      {selectedRegion !== null ? (
        <Raster
          source={
            'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store2.zarr'
          }
          colormap={colormap}
          clim={colorLimits}
          mode={'texture'}
          variable={'ALK'}
          selector={{
            polygon_id: selectedRegion,
            elapsed_time: elapsedTime,
            injection_date: injectionDate,
          }}
        />
      ) : (
        <Regions colormap={colormap} colorLimits={colorLimits} />
      )}
      {children}
    </Map>
  )
}

export default MapWrapper
