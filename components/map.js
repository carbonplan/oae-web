import React, { useMemo } from 'react'
import { Map, Line, Raster, Fill } from '@carbonplan/maps'
import { useThemeUI } from 'theme-ui'
import { useThemedColormap } from '@carbonplan/colormaps'

import useStore, { variables } from '../store'
import Regions from './regions'
import RegionPickerWrapper from './region-picker'
import { generateLogTicks } from '../utils/color'

const bucket = 'https://storage.googleapis.com/carbonplan-maps/'

const frag = (variable) => `
    float value = ${variable};
    bool useLogScale = logScale == 1.0;
    float baseValue = 0.0;
    float blendFactor = 0.1;
    vec4 bgc = vec4(0.0);

    if (value == fillValue || value < threshold) {
      gl_FragColor = vec4(0.0);
      return;
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
      {selectedRegion !== null && currentVariable.key !== 'EFFICIENCY' && (
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
                polygon_id: 1, // TODO: remove hardcoded ID when all polygons become available in data
                injection_date: injectionDate,
              },
            }}
            selector={{
              band: currentVariable.delta ? 'delta' : 'experimental',
              polygon_id: 1, // TODO: remove hardcoded ID when all polygons become available in data
              injection_date: injectionDate,
              year: Math.floor(detailElapsedTime / 12) + 1,
              month: (detailElapsedTime % 12) + 1,
            }}
            uniforms={{
              logScale: logScale ? 1.0 : 0.0,
              threshold: variables[variableFamily].meta.threshold ?? 0.0,
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
      {children}
    </Map>
  )
}

export default MapWrapper
