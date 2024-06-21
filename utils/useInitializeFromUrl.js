import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useStore from '../store'

const useInitializeFromUrl = () => {
  const router = useRouter()
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)

  useEffect(() => {
    if (!router.isReady) return
    const { region } = router.query
    const regionInt = parseInt(region)
    if (!isNaN(regionInt) && regionInt >= 0 && regionInt <= 689) {
      setSelectedRegion(regionInt)
    }
  }, [router.isReady])
}

export default useInitializeFromUrl
