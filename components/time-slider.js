import React, { useEffect } from 'react'
import { Slider } from '@carbonplan/components'
import { Box, Flex } from 'theme-ui'
import { useCallback, useState } from 'react'
import useStore from '../store'
import FooterWrapper from './footer-wrapper'

const sx = {
  label: {
    fontFamily: 'mono',
    letterSpacing: 'mono',
    textTransform: 'uppercase',
    fontSize: [1],
  },
}

const OFFSETS = {
  JAN: 0,
  APR: 3,
  JUL: 6,
  OCT: 9,
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
    <Box sx={{ flex: 1, my: -2 }}>
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
  const elapsedTime = useStore((state) => state.elapsedTime)
  const setElapsedTime = useStore((state) => state.setElapsedTime)
  const injectionSeason = useStore((state) =>
    Object.keys(state.injectionSeason).find((k) => state.injectionSeason[k])
  )

  const handleMonthChange = useCallback(
    (month) => {
      const years = Math.floor(elapsedTime / 12)
      setElapsedTime(years * 12 + month)
    },
    [elapsedTime]
  )

  const handleYearChange = useCallback(
    (year) => {
      const months = elapsedTime % 12
      setElapsedTime(year * 12 + months)
    },
    [elapsedTime]
  )

  return (
    <FooterWrapper>
      <UnitSlider
        value={Math.floor(elapsedTime / 12)}
        range={[0, 14]}
        onChange={handleYearChange}
        formatLabel={(d) => `Year ${d + 1}`}
        showValue
      />
    </FooterWrapper>
  )
}

export default TimeSlider
