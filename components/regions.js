import React, { useEffect } from 'react'
import { useMapbox } from '@carbonplan/maps'

const Regions = ({ hoveredRegion, setHoveredRegion, setSelectedRegion }) => {
  const { map } = useMapbox()

  useEffect(() => {
    const fetchAndAddGeojson = async () => {
      if (!map) return
      if (map.getSource('geojson')) return

      try {
        const response = await fetch('../data/regions.geojson')
        const data = await response.json()

        map.addSource('geojson', { type: 'geojson', data })

        map.addLayer({
          id: 'geojson-layer',
          type: 'fill',
          source: 'geojson',
          paint: { 'fill-color': 'white', 'fill-opacity': 0.5 },
        })

        map.addLayer({
          id: 'highlight-line-layer',
          type: 'line',
          source: 'geojson',
          paint: { 'line-width': 1, 'line-color': 'red' },
          filter: ['==', ['get', 'polygon_id'], ''], // Start with no features highlighted
        })

        map.on('mouseover', 'geojson-layer', (e) => {
          if (e.features.length > 0) {
            const polygonId = e.features[0].properties.polygon_id
            setHoveredRegion(polygonId)
          }
        })

        map.on('mouseleave', 'geojson-layer', () => {
          setHoveredRegion(null)
        })
      } catch (error) {
        console.error('Error fetching or adding geojson:', error)
      }
    }

    fetchAndAddGeojson()
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
