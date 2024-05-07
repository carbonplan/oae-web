import React, { useEffect, useMemo } from 'react'
import { Select, Slider } from '@carbonplan/components'
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
  const { currentVariable, elapsedTime, setElapsedTime } = useStore(
    (state) => ({
      currentVariable: state.currentVariable,
      elapsedTime:
        state.currentVariable.key === 'EFFICIENCY'
          ? state.overviewElapsedTime
          : state.detailElapsedTime,
      setElapsedTime:
        state.currentVariable.key === 'EFFICIENCY'
          ? state.setOverviewElapsedTime
          : state.setDetailElapsedTime,
    })
  )
  const disableMonthSelect = currentVariable.key === 'EFFICIENCY'

  const injectionSeason = useStore((state) =>
    Object.keys(state.injectionSeason).find((k) => state.injectionSeason[k])
  )

  const months = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, index) => {
      const monthIndex = (index + OFFSETS[injectionSeason]) % 12
      const date = new Date(2024, monthIndex, 1)
      return {
        value: index,
        label: date.toLocaleString('default', { month: 'short' }),
      }
    })
    return months
  }, [injectionSeason])

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
      <Flex sx={{ gap: [2, 2, 2, 3] }}>
        <UnitSlider
          value={Math.floor(elapsedTime / 12)}
          range={[0, 14]}
          onChange={handleYearChange}
          formatLabel={(d) => `Year ${d + 1}`}
          showValue
        />
        <Select
          value={elapsedTime % 12}
          size='xs'
          disabled={disableMonthSelect}
          sx={{
            color: disableMonthSelect ? 'muted' : 'secondary',
            ml: 4,
            mt: -2,
            svg: {
              fill: disableMonthSelect ? 'muted' : 'secondary',
            },
          }}
          sxSelect={{
            fontSize: 1,
            fontFamily: 'mono',
            borderBottomColor: disableMonthSelect ? 'muted' : 'secondary',
            transition: 'color 0.2s, border-color 0.2s',
            textTransform: 'uppercase',
            '&:hover': !disableMonthSelect
              ? {
                  color: 'primary',
                  borderBottomColor: 'primary',
                }
              : { cursor: 'not-allowed' },
          }}
          onChange={(e) => handleMonthChange(parseInt(e.target.value))}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Select>
      </Flex>
    </FooterWrapper>
  )
}

export default TimeSlider
