import React, { useMemo } from 'react'
import { Map, Line, Raster, Fill } from '@carbonplan/maps'
import { Box, Flex, useThemeUI } from 'theme-ui'
import { useThemedColormap } from '@carbonplan/colormaps'

import useStore, { variables } from '../store'
import Regions from './regions'
import RegionPickerWrapper from './region-picker'
import { generateLogTicks } from '../utils/color'
import { Button } from '@carbonplan/components'
import { X } from '@carbonplan/icons'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'

const bands = ['experiment', 'counterfactual']

const frag = `
    float value;
    bool isDelta = delta == 1.0;
    bool useLogScale = logScale == 1.0;
    float baseValue = 0.0;
    float blendFactor = 0.1;
    vec4 bgc = vec4(0.0);

    if (!isDelta) {
      value = experiment;
      if (value == fillValue) {
        gl_FragColor = vec4(0.0);
        return;
      }
    }

    if (isDelta) {
      value = experiment - counterfactual;
      if (value < threshold || value == fillValue) {
        gl_FragColor = vec4(0.0);
        return;
      }
    }

    float rescaled;
    if (useLogScale) {
      float log10 = log(10.0);
      rescaled =
        (log(value)/log10 - log(clim.x)/log10) /
        (log(clim.y)/log10 - log(clim.x)/log10);
    } else {
      rescaled = (value - clim.x) / (clim.y - clim.x);
    }
    gl_FragColor = texture2D(colormap, vec2(rescaled, 1.0));
    gl_FragColor.a = opacity;
    gl_FragColor.rgb *= gl_FragColor.a;
  `

const MapWrapper = ({ children }) => {
  const setLoading = useStore((s) => s.setLoading)
  const setRegionDataLoading = useStore((s) => s.setRegionDataLoading)
  const selectedRegion = useStore((s) => s.selectedRegion)
  const setSelectedRegion = useStore((s) => s.setSelectedRegion)
  const hoveredRegion = useStore((s) => s.hoveredRegion)
  const detailElapsedTime = useStore((s) => s.detailElapsedTime)
  const injectionSeason = useStore((s) => s.injectionSeason)
  const currentVariable = useStore((s) => s.currentVariable)
  const variableFamily = useStore((s) => s.variableFamily)
  const showRegionPicker = useStore((s) => s.showRegionPicker)
  const setRegionData = useStore((s) => s.setRegionData)
  const logScale = useStore((s) => s.logScale && s.currentVariable.logScale)

  const colormapLength = logScale
    ? generateLogTicks(
        currentVariable.logColorLimits[0],
        currentVariable.logColorLimits[1]
      ).length
    : undefined
  const colormap = logScale
    ? useThemedColormap(currentVariable.colormap, {
        count: colormapLength,
      }).slice(1, colormapLength)
    : useThemedColormap(currentVariable.colormap)

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
      {selectedRegion !== null && !variables[variableFamily].overview && (
        <>
          <Raster
            key={variableFamily}
            variable={variableFamily}
            source={
              'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/reshaped_time_pyramid.zarr'
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
                polygon_id: 301, // TODO: remove hardcoded ID when all polygons become available in data
                injection_date: injectionDate,
              },
            }}
            selector={{
              band: bands,
              polygon_id: 301, // TODO: remove hardcoded ID when all polygons become available in data
              injection_date: injectionDate,
              year: Math.floor(detailElapsedTime / 12) + 1,
              month: (detailElapsedTime % 12) + 1,
            }}
            uniforms={{
              delta: currentVariable.delta ? 1.0 : 0.0,
              logScale: logScale ? 1.0 : 0.0,
              threshold: variables[variableFamily].threshold ?? 0.0,
            }}
            frag={frag}
          />
          {showRegionPicker && <RegionPickerWrapper />}
        </>
      )}
      {selectedRegion !== null && (
        <Flex
          sx={{
            alignItems: 'center',
            position: 'absolute',
            left: ['50%', '50%', '66%', '66%'],
            top: ['unset', 'unset', '12px', '9px'],
            bottom: ['135px', '135px', 'unset', 'unset'],
            transform: 'translate(-50%, 0)',
            background: 'muted',
            fontFamily: 'mono',
            fontSize: [1, 1, 1, 2],
            height: [32, 32, 32, 36],
            py: 2,
            px: 3,
            borderRadius: 40,
          }}
        >
          <Box>REGION {String(selectedRegion).padStart(3, '0')}</Box>
          {selectedRegion !== null && (
            <Button
              onClick={() => setSelectedRegion(null)}
              size='sm'
              sx={{
                ml: 2,
                fontSize: [1, 1, 1, 2],
                borderLeft: '1px solid',
                borderColor: 'secondary',
              }}
              suffix={
                <X
                  sx={{
                    ml: 2,
                    // mb: ['3px', '3px', '3px', 0],
                    height: 16,
                  }}
                />
              }
            ></Button>
          )}
        </Flex>
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
      {children}
    </Map>
  )
}

export default MapWrapper
