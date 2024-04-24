import React, { useMemo } from 'react'
import { Map, Line, Raster, Fill } from '@carbonplan/maps'
import { Box, useThemeUI } from 'theme-ui'
import { Colorbar } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'

import useStore, { variables } from '../store'
import Regions from './regions'
import RegionPickerWrapper from './region-picker'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'

const bands = ['experiment', 'counterfactual']

const frag = `
    float value;
    bool isDelta = delta == 1.0;
    bool showDeltaOverBackground = showDeltaOverBackground == 1.0;
    float baseValue = 0.0;
    float blendFactor = 0.1;
    vec4 bgc = vec4(0.0);

    if (!isDelta && !showDeltaOverBackground) {
      value = experiment;
      if (value == fillValue) {
        gl_FragColor = vec4(0.0);
        return;
      }
      float rescaled = (value - clim.x) / (clim.y - clim.x);
      gl_FragColor = texture2D(colormap, vec2(rescaled, 1.0));
      gl_FragColor.a = opacity;
      gl_FragColor.rgb *= gl_FragColor.a;
      return;
    }

    if (isDelta && !showDeltaOverBackground) {
      value = experiment - counterfactual;
      if (value < threshold || value == fillValue) {
        gl_FragColor = vec4(0.0);
        return;
      }
      float rescaled = (value - clim.x) / (clim.y - clim.x);
      gl_FragColor = texture2D(colormap, vec2(rescaled, 1.0));
      gl_FragColor.a = opacity;
      gl_FragColor.rgb *= gl_FragColor.a;
      return;
    }

    if (showDeltaOverBackground) {
      value = experiment - counterfactual;
      baseValue = experiment;
      float bgRescaled = (baseValue - clim.x) / (clim.y - clim.x);
      bgc = texture2D(colormap, vec2(bgRescaled, 1.0));
      bgc.a = opacity;
      if (baseValue == fillValue) {
        gl_FragColor = vec4(0.0);
        return;
      }
      if (value < threshold) {
        // background color
        gl_FragColor = vec4(bgc.rgb, bgc.a);
        gl_FragColor.rgb *= gl_FragColor.a;
        return;
      } else {
        // show grey delta
        vec4 greyColor = vec4(1, 1, 1, 1.0);
        vec4 blendedColor = mix(bgc, greyColor, blendFactor * greyColor.a);
        gl_FragColor = vec4(blendedColor.rgb, blendedColor.a);
        gl_FragColor.rgb *= gl_FragColor.a;
        return;
      }
    }
  `

const MapWrapper = ({ children }) => {
  const setLoading = useStore((s) => s.setLoading)
  const setRegionDataLoading = useStore((s) => s.setRegionDataLoading)
  const selectedRegion = useStore((s) => s.selectedRegion)
  const elapsedTime = useStore((s) => s.elapsedTime)
  const injectionSeason = useStore((s) => s.injectionSeason)
  const currentVariable = useStore((s) => s.currentVariable)
  const variableFamily = useStore((s) => s.variableFamily)
  const showRegionPicker = useStore((s) => s.showRegionPicker)
  const setRegionData = useStore((s) => s.setRegionData)
  const showDeltaOverBackground = useStore((s) => s.showDeltaOverBackground)

  const colormap = useThemedColormap(currentVariable.colormap)

  const { theme } = useThemeUI()

  const injectionDate = useMemo(() => {
    return Object.values(injectionSeason).findIndex((value) => value) + 1
  }, [injectionSeason])

  const handleRegionData = (data) => {
    if (data.value === null) {
      setRegionDataLoading(true)
    } else {
      setRegionData(data.value)
      setRegionDataLoading(false)
    }
  }

  return (
    <Map zoom={1.5} center={[140, -45]} debug={false} setLoading={setLoading}>
      {selectedRegion !== null && (
        <>
          <Raster
            source={
              'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/reshaped_time_pyramid.zarr'
            }
            colormap={colormap}
            clim={currentVariable.colorLimits}
            mode={'texture'}
            variable={'ALK'} // TODO: remove hardcoded variable when all values become available in data
            fillValue={9.969209968386869e36}
            regionOptions={{
              setData: handleRegionData,
              selector: {
                polygon_id: 301, // TODO: remove hardcoded ID when all polygons become available in data
                injection_date: injectionDate,
              },
            }}
            selector={{
              band: bands,
              polygon_id: 301, // TODO: remove hardcoded ID when all polygons become available in data
              injection_date: 1,
              year: 1,
              month: 1,
            }}
            uniforms={{
              delta: currentVariable.key.includes('DELTA') ? 1.0 : 0.0,
              showDeltaOverBackground:
                showDeltaOverBackground &&
                !currentVariable.key.includes('DELTA')
                  ? 1.0
                  : 0.0,
              threshold: variables[variableFamily].meta.threshold ?? 0.0,
            }}
            frag={frag}
          />
          {showRegionPicker && <RegionPickerWrapper />}
        </>
      )}
      <Box
        sx={{
          position: 'absolute',
          top: ['72px', '80px', 'unset', 'unset'],
          bottom: ['unset', 'unset', 4, 4],
          right: [3, 4, 5, 6],
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
      <Fill
        color={theme.rawColors.background}
        source={bucket + 'basemaps/land'}
        variable={'land'}
      />
      <Line
        color={theme.rawColors.secondary}
        source={bucket + 'basemaps/land'}
        variable={'land'}
      />
      <Regions />
      {children}
    </Map>
  )
}

export default MapWrapper
