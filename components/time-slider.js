import { Slider } from '@carbonplan/components'
import { Box, Flex } from 'theme-ui'
import { useCallback, useState } from 'react'
import useStore from '../store'

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
    <Box sx={{ flex: 1 }}>
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

const TimeSlider = ({}) => {
  const elapsedTime = useStore((state) => state.elapsedTime)
  const setElapsedTime = useStore((state) => state.setElapsedTime)
  const injectionSeason = useStore((state) =>
    Object.keys(state.injectionSeason).find((k) => state.injectionSeason[k])
  )

  const handleMonthChange = useCallback(
    (month) => {
      const years = Math.floor(elapsedTime / 12)
      setElapsedTime(years + month)
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
    <Flex sx={{ gap: [2, 2, 2, 3] }}>
      <UnitSlider
        value={elapsedTime % 12}
        range={[0, 11]}
        onChange={handleMonthChange}
        formatLabel={(d) =>
          new Date(2024, d + OFFSETS[injectionSeason], 1).toLocaleString(
            'default',
            {
              month: 'short',
            }
          )
        }
        showValue
      />
      <UnitSlider
        value={Math.floor(elapsedTime / 12)}
        range={[0, 14]}
        onChange={handleYearChange}
        formatLabel={(d) => `Year ${d + 1}`}
        debounce
        showValue
      />
    </Flex>
  )
}

export default TimeSlider