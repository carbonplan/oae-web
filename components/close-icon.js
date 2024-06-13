import React, { useMemo, useRef, useEffect } from 'react'
import { X } from '@carbonplan/icons'
import { Button } from '@carbonplan/components'
import useStore from '../store'
import { useMapbox } from '@carbonplan/maps'
import { Marker } from 'mapbox-gl'
import { bbox, nearestPointOnLine, polygonToLine } from '@turf/turf'
import { adjustLongitudeWorldCopy } from '../utils/format'

const CloseIcon = () => {
  const setSelectedRegion = useStore((s) => s.setSelectedRegion)
  const selectedRegionGeojson = useStore((s) => s.selectedRegionGeojson)
  const selectedRegionCenter = useStore((s) => s.selectedRegionCenter)

  const { map } = useMapbox()
  const element = useRef()

  const iconPosition = useMemo(() => {
    if (!selectedRegionGeojson) return

    const boundingBox = bbox(selectedRegionGeojson)
    const northEastCorner = [boundingBox[2], boundingBox[3]]
    const polygonAsLine = polygonToLine(selectedRegionGeojson)
    const northEastPointOfPolygon = nearestPointOnLine(
      polygonAsLine,
      northEastCorner
    )
    const iconPosition = northEastPointOfPolygon.geometry.coordinates

    const adjustedCoordinates = adjustLongitudeWorldCopy(
      iconPosition,
      selectedRegionCenter // based on click, so has correct world copy longitude
    )
    return adjustedCoordinates
  }, [selectedRegionGeojson, selectedRegionCenter])

  useEffect(() => {
    if (!map || !iconPosition || !element.current) return
    const marker = new Marker(element.current, {
      offset: [6, -6],
    })
    marker.setLngLat([iconPosition[0], iconPosition[1]])
    marker.addTo(map)

    return () => marker.remove()
  }, [map, iconPosition, element])

  return (
    <div>
      <Button
        ref={element}
        sx={{
          cursor: 'pointer',
          borderRadius: '50%',
          width: 16,
          height: 16,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'primary',
          color: 'secondary',
          '&:hover': {
            color: 'background',
          },
        }}
        onClick={() => setSelectedRegion(null)}
      >
        <X height={10} width={10} sx={{ display: 'flex' }} />
      </Button>
    </div>
  )
}

export default CloseIcon
