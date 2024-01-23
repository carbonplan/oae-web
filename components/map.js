import React, { useState, useEffect } from 'react'
import { useThemeUI } from 'theme-ui'
import { Map, Line, Raster } from '@carbonplan/maps'
import { useThemedColormap } from '@carbonplan/colormaps'
import Regions from './regions'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'

const MapWrapper = ({
  children,
  setLoading,
  hoveredRegion,
  setHoveredRegion,
  setSelectedRegion,
}) => {
  const { theme } = useThemeUI()
  const colormap = useThemedColormap('warm')

  return (
    <Map zoom={0} center={[0, 0]} debug={false} setLoading={setLoading}>
      <Line
        color={theme.rawColors.secondary}
        source={bucket + 'basemaps/land'}
        variable={'land'}
      />
      <Regions
        hoveredRegion={hoveredRegion}
        setHoveredRegion={setHoveredRegion}
        setSelectedRegion={setSelectedRegion}
      />

      <Raster
        source={
          'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store2.zarr'
        }
        colormap={colormap}
        clim={[0, 300]}
        mode={'texture'}
        variable={'ALK'}
        selector={{
          polygon_id: 0,
          elapsed_time: 2,
          injection_date: 1,
        }}
      />
      {children}
    </Map>
  )
}

export default MapWrapper
