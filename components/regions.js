import { useEffect, useMemo, useRef } from 'react'
import useStore, { overviewVariable } from '../store'
import { useMapbox } from '@carbonplan/maps'
import { useThemeUI } from 'theme-ui'
import { useThemedColormap } from '@carbonplan/colormaps'
import centroid from '@turf/centroid'

const Regions = () => {
  const hoveredRegion = useStore((state) => state.hoveredRegion)
  const setHoveredRegion = useStore((state) => state.setHoveredRegion)
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)
  const setSelectedRegionCenter = useStore(
    (state) => state.setSelectedRegionCenter
  )
  const setRegionsInView = useStore((state) => state.setRegionsInView)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const elapsedTime = useStore((state) => state.elapsedTime)
  const yearsElapsed = Math.round(elapsedTime / 12)

  const colormap = useThemedColormap(overviewVariable.colormap)
  const colorLimits = overviewVariable.colorLimits

  const { map } = useMapbox()
  const { theme } = useThemeUI()
  const hoveredRegionRef = useRef(hoveredRegion)
  const injectionDate =
    Object.values(injectionSeason).findIndex((value) => value) + 1

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

  const buildColorExpression = () => {
    const dataField = `eff_inj_${injectionDate}_year_${yearsElapsed}`

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
      const center = centroid(feature.geometry).geometry.coordinates
      setSelectedRegion(polygonId)
      setSelectedRegionCenter(center)
    }
  }

  useEffect(() => {
    const addRegions = async () => {
      if (!map) return

      try {
        if (!map.getSource('regions')) {
          map.addSource('regions', {
            type: 'vector',
            promoteId: 'polygon_id',
            maxzoom: 0,
            tiles: [
              'https://carbonplan-share.s3.us-west-2.amazonaws.com/oae-efficiency/allPoly/tiles/{z}/{x}/{y}.pbf',
            ],
          })
        }

        map.addLayer({
          id: 'regions-fill',
          type: 'fill',
          source: 'regions',
          'source-layer': 'regions_joined',
          paint: {
            'fill-color': buildColorExpression(),
            'fill-outline-color': transparent,
          },
        })

        map.addLayer({
          id: 'regions-line',
          type: 'line',
          source: 'regions',
          'source-layer': 'regions_joined',
          paint: {
            'line-color': lineColor,
            'line-width': 1,
          },
        })

        map.addLayer({
          id: 'regions-hover',
          type: 'line',
          source: 'regions',
          'source-layer': 'regions_joined',
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
          id: 'regions-selected',
          type: 'line',
          source: 'regions',
          'source-layer': 'regions_joined',
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
    }

    addRegions()

    return () => {
      if (map) {
        map.off('mousemove', 'regions-fill', handleMouseMove)
        map.off('mouseleave', 'regions-fill', handleMouseLeave)
        map.off('click', 'regions-fill', handleClick)

        map.removeFeatureState({
          source: 'regions',
          sourceLayer: 'regions_joined',
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
              sourceLayer: 'regions_joined',
              id: hoveredRegionRef.current,
            },
            { hover: false }
          )
        }

        if (hoveredRegion !== null) {
          map.setFeatureState(
            {
              source: 'regions',
              sourceLayer: 'regions_joined',
              id: hoveredRegion,
            },
            { hover: true }
          )
        }

        hoveredRegionRef.current = hoveredRegion
      }
    }
  }, [map, hoveredRegion])

  const toggleLayerVisibilities = (visible) => {
    const visibility = visible ? 'visible' : 'none'
    map.setLayoutProperty('regions-line', 'visibility', visibility)
    map.setLayoutProperty('regions-hover', 'visibility', visibility)
    map.setLayoutProperty('regions-fill', 'visibility', visibility)
  }

  useEffect(() => {
    map.removeFeatureState({
      source: 'regions',
      sourceLayer: 'regions_joined',
    })
    if (selectedRegion !== null) {
      map.setFeatureState(
        {
          source: 'regions',
          sourceLayer: 'regions_joined',
          id: selectedRegion,
        },
        { selected: true }
      )
      toggleLayerVisibilities(false)
    } else {
      toggleLayerVisibilities(true)
    }
  }, [selectedRegion])

  useEffect(() => {
    const handleRegionsInView = () => {
      if (selectedRegion !== null) return
      if (map.getLayer('regions-fill')) {
        const features = map.queryRenderedFeatures({
          layers: ['regions-fill'],
        })
        const ids = features.map((f) => f.properties.polygon_id)
        setRegionsInView(ids)
      }
    }
    map.on('moveend', handleRegionsInView)
    map.once('idle', handleRegionsInView)
    return () => {
      map.off('moveend', handleRegionsInView)
    }
  }, [selectedRegion, map, setRegionsInView])

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

  useEffect(() => {
    if (map && map.getSource('regions') && map.getLayer('regions-fill')) {
      map.setPaintProperty('regions-fill', 'fill-color', buildColorExpression())
    }
  }, [map, colormap, injectionDate, yearsElapsed])

  return null
}

export default Regions
