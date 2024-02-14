import React, { useMemo } from 'react'
import useStore from '../store'
import { useThemeUI } from 'theme-ui'
import { Map, Line, Raster, RegionPicker } from '@carbonplan/maps'
import Regions from './regions'
import { Colorbar } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'

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
    data.value !== null && setRegionData(data.value)
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
            source={
              'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store2.zarr'
            }
            colormap={colormap}
            clim={currentVariable.colorLimits}
            mode={'texture'}
            variable={currentVariable.key}
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
              backgroundColor={theme.colors.background}
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
      <Colorbar
        colormap={colormap}
        clim={currentVariable.colorLimits}
        label={currentVariable.label}
        units={currentVariable.unit}
        horizontal
        width={'100%'}
        sx={{
          width: '30%',
          position: 'absolute',
          bottom: 3,
          right: 3,
        }}
      />
    </Map>
  )
}

export default MapWrapper
