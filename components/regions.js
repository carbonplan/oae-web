import React, { useEffect } from 'react'
import { useMapbox } from '@carbonplan/maps'

const Regions = ({ hoveredRegion, setHoveredRegion, setSelectedRegion }) => {
  const { map } = useMapbox()

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
            'fill-color': 'white',
            'fill-opacity': 0.0,
          },
        })

        map.addLayer({
          id: 'regions-line-layer',
          type: 'line',
          source: 'geojson',
          paint: {
            'line-color': 'white',
            'line-width': 0.5,
          },
        })

        map.addLayer({
          id: 'highlight-line-layer',
          type: 'line',
          source: 'geojson',
          paint: { 'line-width': 3, 'line-color': 'white' },
          filter: ['==', ['get', 'polygon_id'], ''], // Start with no features highlighted
        })

        map.on('mousemove', 'regions-fill-layer', (e) => {
          map.getCanvas().style.cursor = 'pointer'
          if (e.features.length > 0) {
            const polygonId = e.features[0].properties.polygon_id
            if (polygonId !== hoveredRegion) {
              setHoveredRegion(polygonId)
            }
          }
        })

        map.on('mouseleave', 'regions-fill-layer', () => {
          map.getCanvas().style.cursor = ''
          setHoveredRegion(null)
        })

        map.on('click', 'regions-fill-layer', (e) => {
          if (e.features.length > 0) {
            const polygonId = e.features[0].properties.polygon_id
            setSelectedRegion(polygonId)
          }
        })
      } catch (error) {
        console.error('Error fetching or adding geojson:', error)
      }
    }

    fetchAndAddGeojson()
    return () => {
      if (map) {
        map.off('mousemove', 'regions-fill-layer')
        map.off('mouseleave', 'regions-fill-layer')
        map.off('click', 'regions-fill-layer')
        map.removeLayer('regions-fill-layer')
        map.removeLayer('regions-line-layer')
        map.removeLayer('highlight-line-layer')
      }
    }
  }, [map, setHoveredRegion])

  useEffect(() => {
    if (map && map.getSource('geojson')) {
      const filter =
        hoveredRegion !== null
          ? ['==', ['get', 'polygon_id'], hoveredRegion]
          : ['==', ['get', 'polygon_id'], '']
      map.setFilter('highlight-line-layer', filter)
    }
  }, [map, hoveredRegion])

  return null
}

export default Regions
