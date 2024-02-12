import { useEffect, useMemo, useRef } from 'react'
import useStore from '../store'
import { useMapbox } from '@carbonplan/maps'
import { useThemeUI } from 'theme-ui'

const Regions = ({ colormap, colorLimits }) => {
  const hoveredRegion = useStore((state) => state.hoveredRegion)
  const setHoveredRegion = useStore((state) => state.setHoveredRegion)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)
  const setRegionsInView = useStore((state) => state.setRegionsInView)
  const timeHorizon = useStore((state) => state.timeHorizon)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const { map } = useMapbox()
  const { theme } = useThemeUI()
  const hoveredRegionRef = useRef(hoveredRegion)
  const injectionDate =
    Object.values(injectionSeason).findIndex((value) => value) + 1

  const safeColorMap = useMemo(() => {
    return colormap[0].length === 3
      ? colormap.map((rgb) => `rgb(${rgb.join(',')})`)
      : colormap
  }, [colormap])

  const buildColorExpression = () => {
    const fillColorExpression = [
      'step',
      ['get', `eff_inj_${injectionDate}_year_${timeHorizon}`],
      safeColorMap[0],
    ]
    const totalRange = colorLimits[1] - colorLimits[0]
    const stepIncrement = totalRange / (safeColorMap.length - 1)
    for (let i = 1; i < safeColorMap.length; i++) {
      const threshold = colorLimits[0] + stepIncrement * i
      fillColorExpression.push(threshold, safeColorMap[i])
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
      const polygonId = e.features[0].properties.polygon_id
      setSelectedRegion(polygonId)
    }
  }

  const handleRegionsInView = () => {
    if (map.getLayer('regions-fill')) {
      const features = map.queryRenderedFeatures({
        layers: ['regions-fill'],
      })
      const ids = features.map((f) => f.properties.polygon_id)
      setRegionsInView(ids)
    }
  }

  const handleMoveEnd = () => {
    handleRegionsInView()
  }

  // set regions in initial view
  const onIdle = () => {
    handleRegionsInView()
    map.off('idle', onIdle)
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
              'https://carbonplan-share.s3.us-west-2.amazonaws.com/oae-efficiency/tiles/{z}/{x}/{y}.pbf',
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
          },
        })

        map.addLayer({
          id: 'regions-line',
          type: 'line',
          source: 'regions',
          'source-layer': 'regions_joined',
          paint: {
            'line-color': theme.rawColors.primary,
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              3, // Width when hovered
              0.5, // Default width
            ],
          },
        })

        map.on('mousemove', 'regions-fill', handleMouseMove)
        map.on('mouseleave', 'regions-fill', handleMouseLeave)
        map.on('click', 'regions-fill', handleClick)
        map.on('moveend', handleMoveEnd)
        map.on('idle', onIdle)
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
        map.off('moveend', handleMoveEnd)
        map.off('idle', onIdle)

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

  useEffect(() => {
    if (map && map.getSource('regions') && map.getLayer('regions-line')) {
      map.setPaintProperty(
        'regions-line',
        'line-color',
        theme.rawColors.primary
      )
    }
  }, [map, theme])

  useEffect(() => {
    if (map && map.getSource('regions') && map.getLayer('regions-fill')) {
      map.setPaintProperty('regions-fill', 'fill-color', buildColorExpression())
    }
  }, [map, colormap, injectionDate, timeHorizon])

  return null
}

export default Regions
