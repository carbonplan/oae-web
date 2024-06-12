import { useEffect } from 'react'
import { useMapbox } from '@carbonplan/maps'

const ResizeHandler = ({ mapRef }) => {
  const { map } = useMapbox()
  useEffect(() => {
    if (!mapRef.current || !map) return

    const handleResize = () => {
      map.resize()
    }

    const resizer = new ResizeObserver(handleResize)
    resizer.observe(mapRef.current)

    return () => {
      resizer.disconnect()
    }
  }, [mapRef])

  return null
}

export default ResizeHandler
