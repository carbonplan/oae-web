import React, { useCallback, useEffect, useMemo } from 'react'
import { Map, Line, Raster, Fill } from '@carbonplan/maps'
import { Box, useThemeUI } from 'theme-ui'

import Regions from './regions'
import RegionPickerWrapper from './region-picker'
import CloseIcon from './close-icon'
import useStore, { variables } from '../store'
import { useVariableColormap } from '../utils'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'
const width = 4 // width of sidebar

const frag = (variable) => `
    if (${variable} == fillValue) {
      gl_FragColor = vec4(0.0);
      return;
    }

    float value = ${variable} * unitConversion;
    bool useLogScale = logScale == 1.0;
    float baseValue = 0.0;
    float blendFactor = 0.1;
    vec4 bgc = vec4(0.0);

    if (threshold > 0.0 && value < threshold) {
      gl_FragColor = vec4(0.0);
      return;
    }
    if (threshold < 0.0 && value > threshold) {
      gl_FragColor = vec4(0.0);
      return;
    }

    float rescaled;
    if (useLogScale) {
      float log10 = log(10.0);
      rescaled =
        (log(abs(value))/log10 - log(abs(clim.x))/log10) /
        (log(abs(clim.y))/log10 - log(abs(clim.x))/log10);
    } else {
      rescaled = (value - clim.x) / (clim.y - clim.x);
    }
    gl_FragColor = texture2D(colormap, vec2(rescaled, 1.0));
    gl_FragColor.a = opacity;
    gl_FragColor.rgb *= gl_FragColor.a;
  `
const MONTH_MAP = {
  1: 1,
  2: 4,
  3: 7,
  4: 10,
}
const MapWrapper = () => {
  const setLoading = useStore((s) => s.setLoading)
  const setRegionDataLoading = useStore((s) => s.setRegionDataLoading)
  const selectedRegion = useStore((s) => s.selectedRegion)
  const setSelectedRegion = useStore((s) => s.setSelectedRegion)
  const detailElapsedTime = useStore((s) => s.detailElapsedTime)
  const injectionSeason = useStore((s) => s.injectionSeason)
  const currentVariable = useStore((s) => s.currentVariable)
  const variableFamily = useStore((s) => s.variableFamily)
  const showRegionPicker = useStore((s) => s.showRegionPicker)
  const setShowRegionPicker = useStore((s) => s.setShowRegionPicker)
  const setRegionData = useStore((s) => s.setRegionData)
  const logScale = useStore((s) => s.logScale && s.currentVariable.logScale)

  const colormap = useVariableColormap()
  const { theme } = useThemeUI()

  const injectionDate = useMemo(() => {
    return Object.values(injectionSeason).findIndex((value) => value) + 1
  }, [injectionSeason])

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        if (showRegionPicker) {
          setShowRegionPicker(false)
        } else if (selectedRegion !== null) {
          setSelectedRegion(null)
        }
      }
    },
    [showRegionPicker, selectedRegion]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  const handleRegionData = (data) => {
    if (data.value === null) {
      setRegionDataLoading(true)
    } else if (data.value[variableFamily]?.[1]) {
      setRegionData(data.value)
      setRegionDataLoading(false)
    }
  }
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        top: 0,
        right: 0,
        left: [
          0,
          0,
          `calc(100vw - (${12 - width} * (100vw - 13 * 32px) / 12 + ${
            12 - width
          } * 32px))`,
          `calc(100vw - (${12 - width} * (100vw - 13 * 48px) / 12 + ${
            12 - width
          } * 48px))`,
        ],
        height: '100%',
      }}
    >
      <Map
        zoom={0}
        center={[180, 0]}
        maxZoom={3}
        debug={false}
        setLoading={setLoading}
      >
        {selectedRegion !== null && !variables[variableFamily].overview && (
          <>
            <Raster
              key={variableFamily}
              variable={variableFamily}
              source={
                'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store2.zarr'
              }
              colormap={colormap}
              clim={
                logScale
                  ? currentVariable.logColorLimits
                  : currentVariable.colorLimits
              }
              mode={'texture'}
              fillValue={9.969209968386869e36}
              regionOptions={{
                setData: handleRegionData,
                selector: {
                  band: currentVariable.delta ? 'delta' : 'experimental',
                  polygon_id: selectedRegion,
                  injection_date: MONTH_MAP[injectionDate],
                },
              }}
              selector={{
                band: currentVariable.delta ? 'delta' : 'experimental',
                polygon_id: selectedRegion,
                injection_date: MONTH_MAP[injectionDate],
                year: Math.floor(detailElapsedTime / 12) + 1,
                month: (detailElapsedTime % 12) + 1,
              }}
              uniforms={{
                logScale: logScale ? 1.0 : 0.0,
                threshold:
                  currentVariable.threshold ??
                  variables[variableFamily].threshold ??
                  0.0,
                unitConversion: currentVariable.unitConversion ?? 1.0,
              }}
              frag={frag(variableFamily)}
            />
            {showRegionPicker && <RegionPickerWrapper />}
          </>
        )}
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
        {typeof selectedRegion === 'number' && <CloseIcon />}
      </Map>
    </Box>
  )
}

export default MapWrapper
