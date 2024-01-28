import React, { useEffect } from 'react'
import { useMapbox } from '@carbonplan/maps'
import { useThemeUI } from 'theme-ui'

const Regions = ({
  hoveredRegion,
  setHoveredRegion,
  setSelectedRegion,
  setRegionsInView,
}) => {
  const { map } = useMapbox()
  const { theme } = useThemeUI()

  const handleMouseMove = (e) => {
    map.getCanvas().style.cursor = 'pointer'
    if (e.features.length > 0) {
      const polygonId = e.features[0].properties.polygon_id
      if (polygonId !== hoveredRegion) {
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
    if (map.getLayer('regions-fill-layer')) {
      const features = map.queryRenderedFeatures({
        layers: ['regions-fill-layer'],
      })
      const ids = new Set(features.map((f) => f.properties.polygon_id))
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
    const fetchAndAddGeojson = async () => {
      if (!map) return

      try {
        if (!map.getSource('geojson')) {
          const response = await fetch('../data/regions.geojson')
          const data = await response.json()
          map.addSource('geojson', { type: 'geojson', data })
        }

        map.addLayer({
          id: 'regions-fill-layer',
          type: 'fill',
          source: 'geojson',
          paint: {
            'fill-color': theme.rawColors.primary,
            'fill-opacity': 0.0,
          },
        })

        map.addLayer({
          id: 'regions-line-layer',
          type: 'line',
          source: 'geojson',
          paint: {
            'line-color': theme.rawColors.primary,
            'line-width': 0.5,
          },
        })

        map.addLayer({
          id: 'highlight-line-layer',
          type: 'line',
          source: 'geojson',
          paint: { 'line-width': 3, 'line-color': theme.rawColors.primary },
          filter: ['==', ['get', 'polygon_id'], ''], // Start with no features highlighted
        })

        map.on('mousemove', 'regions-fill-layer', handleMouseMove)
        map.on('mouseleave', 'regions-fill-layer', handleMouseLeave)
        map.on('click', 'regions-fill-layer', handleClick)
        map.on('moveend', handleMoveEnd)
        map.on('idle', onIdle)
      } catch (error) {
        console.error('Error fetching or adding geojson:', error)
      }
    }

    fetchAndAddGeojson()

    return () => {
      if (map) {
        map.off('mousemove', 'regions-fill-layer', handleMouseMove)
        map.off('mouseleave', 'regions-fill-layer', handleMouseLeave)
        map.off('click', 'regions-fill-layer', handleClick)
        map.off('moveend', handleMoveEnd)
        map.off('idle', onIdle)

        if (map.getLayer('regions-fill-layer')) {
          map.removeLayer('regions-fill-layer')
        }
        if (map.getLayer('regions-line-layer')) {
          map.removeLayer('regions-line-layer')
        }
        if (map.getLayer('highlight-line-layer')) {
          map.removeLayer('highlight-line-layer')
        }
      }
    }
  }, [
    map,
    setHoveredRegion,
    hoveredRegion,
    setSelectedRegion,
    setRegionsInView,
    theme,
  ])

  useEffect(() => {
    if (map && map.getSource('geojson')) {
      const filter =
        hoveredRegion !== null
          ? ['==', ['get', 'polygon_id'], hoveredRegion]
          : ['==', ['get', 'polygon_id'], '']
      map.setFilter('highlight-line-layer', filter)
    }
  }, [map, hoveredRegion])

  useEffect(() => {
    if (map && map.getSource('geojson')) {
      map.setPaintProperty(
        'regions-fill-layer',
        'fill-color',
        theme.rawColors.primary
      )
      map.setPaintProperty(
        'regions-line-layer',
        'line-color',
        theme.rawColors.primary
      )
      map.setPaintProperty(
        'highlight-line-layer',
        'line-color',
        theme.rawColors.primary
      )
    }
  }, [map, theme])

  return null
}

export default Regions
