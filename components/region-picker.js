import React, { useCallback } from 'react'
import { RegionPicker, useMapbox } from '@carbonplan/maps'
import { useThemeUI } from 'theme-ui'

import useStore from '../store'

const RegionPickerWrapper = () => {
  const selectedRegionCenter = useStore((state) => state.selectedRegionCenter)
  const { theme } = useThemeUI()
  const { map } = useMapbox()

  const isCenterInView = useCallback(
    (center) => {
      const bounds = map.getBounds()
      return bounds.contains(center)
    },
    [map]
  )

  return (
    <RegionPicker
      color={theme.rawColors.primary}
      backgroundColor={'#00000099'}
      fontFamily={theme.fonts.mono}
      fontSize={'14px'}
      maxRadius={2000}
      initialCenter={
        isCenterInView(selectedRegionCenter) ? selectedRegionCenter : null
      }
    />
  )
}

export default RegionPickerWrapper
