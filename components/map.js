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
    bool isDelta = false;
    float baseValue = 0.0;
    float blendFactor = 0.5;
    vec4 bgc = vec4(0.0);

    if (deltaAlk == 1.0 || deltaDIC == 1.0) {
        value = (deltaAlk == 1.0) ? ALK - ALK_ALT_CO2 : DIC - DIC_ALT_CO2;
        baseValue = (deltaAlk == 1.0) ? ALK_ALT_CO2 : DIC_ALT_CO2;
        if (baseValue == fillValue) baseValue = 0.0;
        isDelta = true;
    } else if (alk == 1.0) {
        value = ALK;
    } else if (alkAlt == 1.0) {
        value = ALK_ALT_CO2;
    } else if (dic == 1.0) {
        value = DIC;
    } else if (dicAlt == 1.0) {
        value = DIC_ALT_CO2;
    }

    if (value == fillValue) {
        gl_FragColor = vec4(0.0);
        return;
    }

    if (showBG == 0.0 || (!isDelta && showBG == 1.0)) {
        float rescaled = (value - clim.x) / (clim.y - clim.x);
        gl_FragColor = texture2D(colormap, vec2(rescaled, 1.0));
        gl_FragColor.a = opacity;
        gl_FragColor.rgb *= gl_FragColor.a;
        return;
    }
    
    // background mixing
    float bgRescaled = (baseValue - bgColorLow) / (bgColorHigh - bgColorLow);
    bgc = texture2D(colormap, vec2(bgRescaled, 1.0));
    bgc.a = opacity;
    if (abs(value) <= threshold) {
      // background color
      gl_FragColor = vec4(bgc.rgb, bgc.a);
      gl_FragColor.rgb *= gl_FragColor.a;
    } else {
      // show grey delta
      float deltaRescaled = (value - clim.x) / (clim.y - clim.x);
      vec4 deltaColor = texture2D(colormap, vec2(deltaRescaled, 1.0));
      float greyScale = 0.299 * deltaColor.r + 0.587 * deltaColor.g + 0.114 * deltaColor.b;
      greyScale = 1.0 - greyScale;
      vec4 invertedGreyColor = vec4(greyScale, greyScale, greyScale, 0.5);
      vec4 blendedColor = mix(bgc, invertedGreyColor, blendFactor * invertedGreyColor.a);
      gl_FragColor = vec4(blendedColor.rgb, blendedColor.a);
      gl_FragColor.rgb *= gl_FragColor.a;
    }
  `

const MapWrapper = ({ children }) => {
  const setLoading = useStore((state) => state.setLoading)
  const setRegionDataLoading = useStore((state) => state.setRegionDataLoading)
  const selectedRegion = useStore((state) => state.selectedRegion)
  const elapsedTime = useStore((state) => state.elapsedTime)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const currentVariable = useStore((state) => state.currentVariable)
  const variableFamily = useStore((state) => state.variableFamily)
  const showRegionPicker = useStore((state) => state.showRegionPicker)
  const setRegionData = useStore((state) => state.setRegionData)
  const showBackgroundInDiff = useStore((state) => state.showBackgroundInDiff)

  const colormap = useThemedColormap(currentVariable.colormap)

  const { theme } = useThemeUI()

  const secondaryColorLimits = variables[variableFamily].variables.find(
    (v) => v.key === variableFamily
  ).colorLimits
  const colorBarClimOverride = showBackgroundInDiff
    ? secondaryColorLimits
    : currentVariable.colorLimits
  const colorBarLabelOverride = showBackgroundInDiff
    ? variables[variableFamily].variables.find((v) => v.key === variableFamily)
        .label
    : currentVariable.label

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
              deltaAlk: currentVariable.key === 'DELTA_ALK' ? 1.0 : 0.0,
              deltaDIC: currentVariable.key === 'DELTA_DIC' ? 1.0 : 0.0,
              alk: currentVariable.key === 'ALK' ? 1.0 : 0.0,
              alkAlt: currentVariable.key === 'ALK_ALT_CO2' ? 1.0 : 0.0,
              dic: currentVariable.key === 'DIC' ? 1.0 : 0.0,
              dicAlt: currentVariable.key === 'DIC_ALT_CO2' ? 1.0 : 0.0,
              bgColorHigh: secondaryColorLimits[1],
              bgColorLow: secondaryColorLimits[0],
              showBG: showBackgroundInDiff ? 1.0 : 0.0,
              threshold: currentVariable.threshold ?? 0.0,
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
          clim={colorBarClimOverride}
          label={colorBarLabelOverride}
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
