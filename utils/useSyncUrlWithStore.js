import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useStore from '../store'

const useSyncUrlWithStore = () => {
  const router = useRouter()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const { variableFamily, currentVariable, logScale, selectedRegion } =
    useStore((state) => ({
      variableFamily: state.variableFamily,
      currentVariable: state.currentVariable,
      logScale: state.logScale,
      selectedRegion: state.selectedRegion,
    }))

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
      return
    }

    const query = { ...router.query }

    if (variableFamily) query.variableFamily = variableFamily
    if (currentVariable) query.currentVariable = currentVariable.label
    if (logScale !== undefined) query.logScale = logScale
    if (selectedRegion) query.selectedRegion = selectedRegion

    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    })
  }, [variableFamily, currentVariable, logScale, selectedRegion, router])
}

export default useSyncUrlWithStore
