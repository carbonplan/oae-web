import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import useStore from '../store'

const useRegionUrlSync = () => {
  const router = useRouter()
  const selectedRegion = useStore((state) => state.selectedRegion)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)
  const regionGeojson = useStore((state) => state.regionGeojson)
  const isInitialized = useRef(false)

  const isValidRegion = (region) => {
    const regionNumber = parseInt(region)
    return !isNaN(regionNumber) && regionNumber >= 0 && regionNumber <= 689
  }

  // url to state
  useEffect(() => {
    if (router.isReady && !isInitialized.current && regionGeojson) {
      const { region } = router.query
      if (isValidRegion(region)) {
        setSelectedRegion(parseInt(region))
      } else {
        setSelectedRegion(null)
      }
      isInitialized.current = true
    }
  }, [router.isReady, router.query, setSelectedRegion, regionGeojson])

  // state to url
  useEffect(() => {
    if (router.isReady && isInitialized.current) {
      const currentRegion = router.query.region
      const newRegion =
        selectedRegion !== null ? selectedRegion.toString() : undefined
      if (currentRegion !== newRegion) {
        const newQuery = { ...router.query }
        if (newRegion !== undefined) {
          newQuery.region = newRegion
        } else {
          delete newQuery.region
        }
        router.replace(
          { pathname: router.pathname, query: newQuery },
          undefined,
          { shallow: true }
        )
      }
    }
  }, [selectedRegion, router])

  return null
}

export default useRegionUrlSync
