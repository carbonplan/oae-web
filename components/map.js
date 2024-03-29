import React, { useMemo } from 'react'
import { Map, Line, Raster, RegionPicker, Fill } from '@carbonplan/maps'
import { Box, useThemeUI } from 'theme-ui'
import { Colorbar } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'

import useStore, { variables } from '../store'
import Regions from './regions'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'

const bands = ['ALK', 'ALK_ALT_CO2', 'DIC', 'DIC_ALT_CO2']

const frag = `
    float value;
    bool isDelta = delta == 1.0;
    bool showDeltaOverBackground = showDeltaOverBackground == 1.0;
    bool isDIC = varFam == 1.0;
    bool isALK = varFam == 0.0;
    float baseValue = 0.0;
    float blendFactor = 0.1;
    vec4 bgc = vec4(0.0);

    if (!isDelta && !showDeltaOverBackground) {
      if (varFam == 0.0) {
        value = ALK;
      } else {
        value = DIC;
      }
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
      value = isALK ? ALK - ALK_ALT_CO2 : DIC - DIC_ALT_CO2;
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
      value = isALK ? ALK - ALK_ALT_CO2 : DIC - DIC_ALT_CO2;
      baseValue = isALK ? ALK : DIC;
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

  const varFamUniform = () => {
    if (variableFamily === 'ALK') {
      return 0.0
    }
    if (variableFamily === 'DIC') {
      return 1.0
    }
    return 0.0
  }

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
    <Map zoom={0} center={[0, 0]} debug={false} setLoading={setLoading}>
      {selectedRegion !== null && (
        <>
          <Raster
            source={
              'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store2.zarr'
            }
            colormap={colormap}
            clim={currentVariable.colorLimits}
            mode={'texture'}
            variable={'outputs'}
            fillValue={9.969209968386869e36}
            regionOptions={{
              setData: handleRegionData,
              selector: {
                polygon_id: selectedRegion,
                injection_date: injectionDate,
              },
            }}
            selector={{
              band: bands,
              polygon_id: selectedRegion,
              injection_date: injectionDate,
              elapsed_time: elapsedTime,
            }}
            uniforms={{
              varFam: varFamUniform(),
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
