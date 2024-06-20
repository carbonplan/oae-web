import React, { useEffect } from 'react'
import { RegionPicker, useMapbox, useRegion } from '@carbonplan/maps'
import { useThemeUI } from 'theme-ui'

import useStore from '../store'

const RegionPickerWrapper = () => {
  const selectedRegionCenter = useStore((state) => state.selectedRegionCenter)
  const setCirclePickerMetaData = useStore(
    (state) => state.setCirclePickerMetaData
  )
  const { theme } = useThemeUI()
  const { map } = useMapbox()
  const { region } = useRegion()

  useEffect(() => {
    if (selectedRegionCenter) {
      const isCenterInView = map.getBounds().contains(selectedRegionCenter)
      if (!isCenterInView) map.flyTo({ center: selectedRegionCenter })
    }
  }, [])

  useEffect(() => {
    if (region) {
      setCirclePickerMetaData(region)
    }
  }, [region])

  return (
    <RegionPicker
      color={theme.rawColors.primary}
      backgroundColor={'#00000099'}
      fontFamily={theme.fonts.mono}
      fontSize={'14px'}
      maxRadius={2000}
      minRadius={100}
      initialCenter={selectedRegionCenter ? selectedRegionCenter : null}
    />
  )
}

export default RegionPickerWrapper
