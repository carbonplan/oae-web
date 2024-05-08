import React, { useEffect } from 'react'
import { Slider } from '@carbonplan/components'
import { Box, Flex } from 'theme-ui'
import { useCallback, useState } from 'react'

import useStore from '../../store'

const sx = {
  label: {
    fontFamily: 'mono',
    letterSpacing: 'mono',
    textTransform: 'uppercase',
    color: 'secondary',
    fontSize: [1],
  },
}

const UnitSlider = ({
  value,
  range,
  onChange,
  formatLabel,
  formatValue,
  showValue,
  debounce = false,
}) => {
  const [sliderValue, setSliderValue] = useState(value)
  const [sliding, setSliding] = useState(false)

  useEffect(() => {
    setSliderValue(value)
  }, [value])

  const handleChange = useCallback(
    (e) => {
      const updatedValue = parseFloat(e.target.value)
      setSliderValue(updatedValue)

      if (!debounce || !sliding) {
        onChange(updatedValue)
      }
    },
    [onChange, debounce, sliding]
  )

  const handleMouseUp = useCallback(() => {
    setSliding(false)
    if (debounce) onChange(sliderValue)
  }, [onChange, sliderValue, debounce])

  const handleMouseDown = useCallback(() => {
    setSliding(true)
  }, [onChange, sliderValue, debounce])

  let formattedValue = sliderValue
  if (formatValue) {
    formattedValue = formatValue(sliderValue)
  } else if (formatLabel) {
    formattedValue = formatLabel(sliderValue)
  }

  return (
    <Box sx={{ flex: 1, mt: -2, mb: -3 }}>
      <Slider
        value={sliderValue}
        min={range[0]}
        max={range[1]}
        step={1}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onChange={handleChange}
      />
      <Flex sx={{ justifyContent: 'center' }}>
        <Box
          sx={{
            ...sx.label,
            color: sliding ? 'primary' : 'secondary',
            opacity: sliding || showValue ? 1 : 0,
            transition: 'opacity 0.2s, color 0.2s',
          }}
        >
          {formattedValue}
        </Box>
      </Flex>
    </Box>
  )
}

const TimeSlider = () => {
  const { elapsedTime, setElapsedTime } = useStore((state) => ({
    elapsedTime:
      state.currentVariable.key === 'EFFICIENCY'
        ? state.overviewElapsedTime
        : state.detailElapsedTime,
    setElapsedTime:
      state.currentVariable.key === 'EFFICIENCY'
        ? state.setOverviewElapsedTime
        : state.setDetailElapsedTime,
  }))
  const handleYearChange = useCallback(
    (year) => {
      const months = elapsedTime % 12
      setElapsedTime(year * 12 + months)
    },
    [elapsedTime]
  )

  return (
    <Flex sx={{ gap: [4, 5, 5, 6], alignItems: 'center' }}>
      <Box sx={{ ...sx.label, mt: -2 }}>Time</Box>
      <UnitSlider
        value={Math.floor(elapsedTime / 12)}
        range={[0, 14]}
        onChange={handleYearChange}
        formatLabel={(d) => `Year ${d + 1}`}
        showValue
      />
    </Flex>
  )
}

export default TimeSlider
