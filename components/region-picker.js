import React, { useMemo } from 'react'
import { RegionPicker, useMapbox } from '@carbonplan/maps'
import { useThemeUI } from 'theme-ui'

import useStore from '../store'

const RegionPickerWrapper = () => {
  const selectedRegionCenter = useStore((state) => state.selectedRegionCenter)
  const { theme } = useThemeUI()
  const { map } = useMapbox()

  if (selectedRegionCenter) {
    const isCenterInView = map.getBounds().contains(selectedRegionCenter)
    if (!isCenterInView) map.flyTo({ center: selectedRegionCenter })
  }

  return (
    <RegionPicker
      color={theme.rawColors.primary}
      backgroundColor={'#00000099'}
      fontFamily={theme.fonts.mono}
      fontSize={'14px'}
      maxRadius={2000}
      initialCenter={selectedRegionCenter ? selectedRegionCenter : null}
    />
  )
}

export default RegionPickerWrapper
