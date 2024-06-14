import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useStore, { variables } from '../store'
import { useMapbox } from '@carbonplan/maps'
import { useThemeUI } from 'theme-ui'
import { useThemedColormap } from '@carbonplan/colormaps'
import { centerOfMass } from '@turf/turf'

const Regions = () => {
  const hoveredRegion = useStore((s) => s.hoveredRegion)
  const setHoveredRegion = useStore((s) => s.setHoveredRegion)
  const selectedRegion = useStore((s) => s.selectedRegion)
  const setSelectedRegion = useStore((s) => s.setSelectedRegion)
  const selectedRegionCenter = useStore((s) => s.selectedRegionCenter)
  const setSelectedRegionCenter = useStore((s) => s.setSelectedRegionCenter)
  const filterToRegionsInView = useStore((s) => s.filterToRegionsInView)
  const setRegionsInView = useStore((s) => s.setRegionsInView)
  const currentVariable = useStore((s) => s.currentVariable)
  const overviewLineData = useStore(
    (s) =>
      s.overviewLineData[
        `${s.currentVariable.key}_${s.currentVariable.label}_${
          Object.values(s.injectionSeason).findIndex((value) => value) + 1
        }`
      ]
  )
  const regionGeojson = useStore((s) => s.regionGeojson)
  const setRegionGeojson = useStore((s) => s.setRegionGeojson)
  const overviewElapsedTime = useStore((s) => s.overviewElapsedTime)
  const variableFamily = useStore((s) => s.variableFamily)
  const selectedRegionGeojson = useStore((s) => s.selectedRegionGeojson)

  const colormap = useThemedColormap(currentVariable.colormap)
  const colorLimits = currentVariable.colorLimits

  const { map } = useMapbox()
  const { theme } = useThemeUI()
  const hoveredRegionRef = useRef(hoveredRegion)

  const buildColorExpression = () => {
    const dataField = 'currentValue'
    const fillColorExpression = [
      'case',
      ['has', dataField],
      ['step', ['get', dataField], safeColorMap[0]],
      transparent,
    ]
    const totalRange = colorLimits[1] - colorLimits[0]
    const stepIncrement = totalRange / (safeColorMap.length - 1)
    for (let i = 1; i < safeColorMap.length; i++) {
      const threshold = colorLimits[0] + stepIncrement * i
      fillColorExpression[2].push(threshold, safeColorMap[i])
    }
    return fillColorExpression
  }

  useEffect(() => {
    if (!regionGeojson || !overviewLineData) return
    // get currentValue from overviewLineData for each polygon and assign to new current value property
    const features = regionGeojson.features.map((feature) => {
      const polygonId = feature.properties.polygon_id
      const currentValue =
        overviewLineData[polygonId]?.data?.[overviewElapsedTime][1]
      return {
        ...feature,
        properties: {
          ...feature.properties,
          currentValue,
        },
      }
    })
    if (map && map.getSource('regions')) {
      const colorExpression = buildColorExpression()
      map.getSource('regions').setData({ ...regionGeojson, features })
      map.setPaintProperty('regions-fill', 'fill-color', colorExpression)
      map.setPaintProperty(
        'selected-region-fill',
        'fill-color',
        colorExpression
      )
    }
  }, [regionGeojson, overviewElapsedTime, overviewLineData])

  //reused colors
  const transparent = 'rgba(0, 0, 0, 0)'
  const lineColor = theme.rawColors.hinted
  const lineHighlightColor = [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    theme.rawColors?.primary,
    transparent,
  ]

  const safeColorMap = useMemo(() => {
    return colormap[0].length === 3
      ? colormap.map((rgb) => `rgb(${rgb.join(',')})`)
      : colormap
  }, [colormap])

  const handleMouseMove = (e) => {
    map.getCanvas().style.cursor = 'pointer'
    if (e.features.length > 0) {
      const polygonId = e.features[0].properties.polygon_id
      if (polygonId !== hoveredRegionRef.current) {
        setHoveredRegion(polygonId)
      }
    }
  }

  const handleMouseLeave = () => {
    map.getCanvas().style.cursor = ''
    setHoveredRegion(null)
  }

  const handleClick = (e) => {
    if (e.features.length > 0) {
      const feature = e.features[0]
      const polygonId = feature.properties.polygon_id
      const center = [e.lngLat.lng, e.lngLat.lat]
      setSelectedRegion(polygonId)
      setSelectedRegionCenter(center)
    }
  }

  const addRegions = async () => {
    fetch('/regions.geojson')
      .then((response) => response.json())
      .then((data) => {
        setRegionGeojson(data)
        try {
          if (!map.getSource('regions')) {
            map.addSource('regions', {
              type: 'geojson',
              data: data,
              promoteId: 'polygon_id',
              maxzoom: 0,
            })
          }

          map.addLayer({
            id: 'regions-fill',
            type: 'fill',
            source: 'regions',
            paint: {
              'fill-color': transparent,
              'fill-outline-color': transparent,
            },
          })

          map.addLayer({
            id: 'regions-line',
            type: 'line',
            source: 'regions',
            paint: {
              'line-color': lineColor,
              'line-width': 1,
            },
          })

          map.addLayer({
            id: 'regions-hover',
            type: 'line',
            source: 'regions',
            paint: {
              'line-color': lineHighlightColor,
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                2, // Width when hovered
                0, // Default width
              ],
            },
          })

          map.addLayer({
            id: 'selected-region-fill',
            type: 'fill',
            source: 'regions',
            paint: {
              'fill-color': transparent,
              'fill-outline-color': transparent,
              'fill-opacity': [
                'case',
                [
                  'all',
                  ['boolean', ['feature-state', 'selected'], false],
                  ['boolean', ['feature-state', 'overview'], false],
                ],
                1, // Opacity when an overview var is selected is active
                0, // Default opacity
              ],
            },
          })
          map.addLayer({
            id: 'regions-selected',
            type: 'line',
            source: 'regions',
            paint: {
              'line-color': theme.rawColors.primary,
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                2, // Width when hovered
                0, // Default width
              ],
            },
          })

          map.on('mousemove', 'regions-fill', handleMouseMove)
          map.on('mouseleave', 'regions-fill', handleMouseLeave)
          map.on('click', 'regions-fill', handleClick)
        } catch (error) {
          console.error('Error fetching or adding regions:', error)
        }
      })
  }

  useEffect(() => {
    addRegions()
    return () => {
      if (map && map.getSource('regions')) {
        map.off('mousemove', 'regions-fill', handleMouseMove)
        map.off('mouseleave', 'regions-fill', handleMouseLeave)
        map.off('click', 'regions-fill', handleClick)

        map.removeFeatureState({
          source: 'regions',
        })

        if (map.getLayer('regions-fill')) {
          map.removeLayer('regions-fill')
        }
        if (map.getLayer('regions-line')) {
          map.removeLayer('regions-line')
        }
        if (map.getLayer('regions-hover')) {
          map.removeLayer('regions-hover')
        }
        if (map.getLayer('regions-selected')) {
          map.removeLayer('regions-selected')
        }
        if (map.getLayer('selected-region-fill')) {
          map.removeLayer('selected-region-fill')
        }
      }
    }
  }, [])

  useEffect(() => {
    if (map && map.getSource('regions')) {
      if (hoveredRegion !== hoveredRegionRef.current) {
        if (hoveredRegionRef.current !== null) {
          map.setFeatureState(
            {
              source: 'regions',
              id: hoveredRegionRef.current,
            },
            { hover: false }
          )
        }

        if (hoveredRegion !== null) {
          map.setFeatureState(
            {
              source: 'regions',
              id: hoveredRegion,
            },
            { hover: true }
          )
        }

        hoveredRegionRef.current = hoveredRegion
      }
    }
  }, [map, hoveredRegion])

  const handleRegionsInView = useCallback(() => {
    if (selectedRegion !== null) return
    if (
      map.getLayer('regions-fill') &&
      map.getLayoutProperty('regions-fill', 'visibility') === 'visible'
    ) {
      const features = map.queryRenderedFeatures({
        layers: ['regions-fill'],
      })
      const ids = features.map((f) => f.properties.polygon_id)
      setRegionsInView(ids)
    }
  }, [map, selectedRegion, setRegionsInView])

  const toggleLayerVisibilities = useCallback(
    (visible) => {
      if (!map) return
      const visibility = visible ? 'visible' : 'none'
      map.setLayoutProperty('regions-line', 'visibility', visibility)
      map.setLayoutProperty('regions-hover', 'visibility', visibility)
      map.setLayoutProperty('regions-fill', 'visibility', visibility)
      if (visible && filterToRegionsInView) {
        // fixes race when clearing selected region
        map.once('idle', handleRegionsInView)
      }
    },
    [map, handleRegionsInView, filterToRegionsInView]
  )

  useEffect(() => {
    if (!map || !map.getSource('regions')) return
    map.removeFeatureState({
      source: 'regions',
    })
    if (selectedRegion !== null) {
      map.setFeatureState(
        {
          source: 'regions',
          id: selectedRegion,
        },
        { selected: true }
      )

      map.setFeatureState(
        {
          source: 'regions',
          id: selectedRegion,
        },
        { overview: variables[variableFamily].overview }
      )
      toggleLayerVisibilities(false)
    } else {
      toggleLayerVisibilities(true)
    }
  }, [selectedRegion, map, currentVariable, toggleLayerVisibilities])

  useEffect(() => {
    if (!filterToRegionsInView) {
      map.off('moveend', handleRegionsInView)
      setRegionsInView(null)
      return
    }
    map.on('moveend', handleRegionsInView)
    return () => {
      map.off('moveend', handleRegionsInView)
    }
  }, [map, handleRegionsInView, filterToRegionsInView])

  useEffect(() => {
    // get center and fly to selected region when selected via time series
    if (typeof selectedRegion === 'number' && !selectedRegionCenter) {
      const center = centerOfMass(selectedRegionGeojson).geometry.coordinates
      setSelectedRegionCenter(center)
      const bounds = map.getBounds()
      if (!bounds.contains(center)) {
        setTimeout(() => {
          // timeout prevents warnings with flushSync during react render
          map.jumpTo({ center }) // flyTo is choppy in this case
        }, 0)
      }
    }
  }, [
    selectedRegion,
    selectedRegionCenter,
    regionGeojson,
    map,
    setSelectedRegionCenter,
  ])

  useEffect(() => {
    if (map && map.getSource('regions') && map.getLayer('regions-line')) {
      map.setPaintProperty('regions-line', 'line-color', lineColor)
      map.setPaintProperty('regions-hover', 'line-color', lineHighlightColor)
      map.setPaintProperty(
        'regions-selected',
        'line-color',
        theme.rawColors.primary
      )
    }
  }, [map, theme])

  return null
}

export default Regions
