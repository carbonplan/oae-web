import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useStore, { variables } from '../store'

const useInitializeFromUrl = () => {
  const router = useRouter()
  const setVariableFamily = useStore((state) => state.setVariableFamily)
  const setCurrentVariable = useStore((state) => state.setCurrentVariable)
  const setLogScale = useStore((state) => state.setLogScale)
  const setSelectedRegion = useStore((state) => state.setSelectedRegion)

  useEffect(() => {
    const { variableFamily, currentVariable, logScale, region } = router.query
    console.log('reading query')

    const currentVariableValue = variables[variableFamily]?.variables.find(
      (variable) => variable.label === currentVariable
    )

    // selectedRegion must come first so that the default variable is overridden below
    if (region) setSelectedRegion(parseInt(region))
    if (variableFamily) setVariableFamily(variableFamily)
    if (currentVariableValue) setCurrentVariable(currentVariableValue)
    if (logScale) setLogScale(logScale === 'true')
  }, [router.isReady])
}

export default useInitializeFromUrl
