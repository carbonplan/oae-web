import React, { useMemo } from 'react'
import { Map, Line, Raster, RegionPicker, Fill } from '@carbonplan/maps'
import { Box, useThemeUI } from 'theme-ui'
import { Colorbar } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'

import useStore, { variables } from '../store'
import Regions from './regions'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'

const bands = ['ALK', 'ALK_ALT_CO2', 'DIC', 'DIC_ALT_CO2']

const MapWrapper = ({ children, setLoading }) => {
  const selectedRegion = useStore((state) => state.selectedRegion)
  const elapsedTime = useStore((state) => state.elapsedTime)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const currentVariable = useStore((state) => state.currentVariable)
  const showRegionPicker = useStore((state) => state.showRegionPicker)
  const setRegionData = useStore((state) => state.setRegionData)

  const colormap = useThemedColormap(currentVariable.colormap)

  const { theme } = useThemeUI()

  const alkColorLimits = variables.find((v) => v.key === 'ALK').colorLimits
  const dicColorLimits = variables.find((v) => v.key === 'DIC').colorLimits
  const secondaryColorLimits =
    currentVariable.key === 'DELTA_ALK' ? alkColorLimits : dicColorLimits

  const frag = `
    float value;
    if (deltaAlk == 1.0) {
      value = ALK - ALK_ALT_CO2;
    }
    if (deltaDIC == 1.0) {
      value = DIC - DIC_ALT_CO2;
    }
    if (alk == 1.0) {
      value = ALK;
    }
    if (alkAlt == 1.0) {
      value = ALK_ALT_CO2;
    }
    if (dic == 1.0) {
      value = DIC;
    }
    if (dicAlt == 1.0) {
      value = DIC_ALT_CO2;
    }

    if (showBG == 1.0 && abs(value) < 0.001) {
        float baseLine;
        if (deltaAlk == 1.0) {
          baseLine = ALK_ALT_CO2;
        } else {
          baseLine = DIC_ALT_CO2;
        }
        if (baseLine == fillValue) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        } else {
            
            float backRescaled = (baseLine - bgColorLow) / (bgColorHigh - bgColorLow);
            vec4 bgc = texture2D(colormap, vec2(backRescaled, 1.0));
            gl_FragColor = vec4(bgc.x, bgc.y, bgc.z, 0.2);
        }
        gl_FragColor.rgb *= gl_FragColor.a;
        return;
    }

    if (value == 0.0 || value == fillValue) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        gl_FragColor.rgb *= gl_FragColor.a;
        return;
    }

    float rescaled = (value - clim.x) / (clim.y - clim.x);
    vec4 c = texture2D(colormap, vec2(rescaled, 1.0));
    gl_FragColor = vec4(c.x, c.y, c.z, opacity);
    gl_FragColor.rgb *= gl_FragColor.a;
  `

  const injectionDate = useMemo(() => {
    return Object.values(injectionSeason).findIndex((value) => value) + 1
  }, [injectionSeason])

  const handleRegionData = (data) => {
    if (data.value === null) return
    setRegionData(data.value)
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
              showBG:
                currentVariable.key === 'DELTA_ALK' ||
                currentVariable.key === 'DELTA_DIC'
                  ? 1.0
                  : 0.0,
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
