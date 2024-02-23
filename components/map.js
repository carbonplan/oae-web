import React, { useMemo } from 'react'
import { Map, Line, Raster, RegionPicker } from '@carbonplan/maps'
import { Box, useThemeUI } from 'theme-ui'
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
  const showRegionPicker = useStore((state) => state.showRegionPicker)
  const setRegionData = useStore((state) => state.setRegionData)

  const colormap = useThemedColormap(currentVariable.colormap)

  const { theme } = useThemeUI()

  const injectionDate = useMemo(() => {
    return Object.values(injectionSeason).findIndex((value) => value) + 1
  }, [injectionSeason])

  const handleRegionData = (data) => {
    if (data.value === null) return
    setRegionData(data.value)
  }

  return (
    <Map zoom={0} center={[0, 0]} debug={false} setLoading={setLoading}>
      <Line
        color={theme.rawColors.secondary}
        source={bucket + 'basemaps/land'}
        variable={'land'}
      />
      {selectedRegion !== null ? (
        <>
          <Raster
            key={currentVariable.key}
            source={
              'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store2.zarr'
            }
            colormap={colormap}
            clim={currentVariable.colorLimits}
            mode={'texture'}
            variable={currentVariable.key}
            fillValue={9.969209968386869e36}
            regionOptions={{
              setData: handleRegionData,
              selector: {
                polygon_id: selectedRegion,
                injection_date: injectionDate,
              },
            }}
            selector={{
              polygon_id: selectedRegion,
              elapsed_time: elapsedTime,
              injection_date: injectionDate,
            }}
          />
          {showRegionPicker && (
            <RegionPicker
              color={theme.colors.primary}
              backgroundColor={'#00000099'}
              fontFamily={theme.fonts.mono}
              fontSize={'14px'}
              maxRadius={2000}
            />
          )}
        </>
      ) : (
        <Regions />
      )}
      {children}
      <Box
        sx={{
          position: 'absolute',
          top: ['80px', '80px', 'unset', 'unset'],
          bottom: ['unset', 'unset', 4, 4],
          right: 4,
        }}
      >
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
