import React, { useMemo } from 'react'
import { Select } from '@carbonplan/components'
import { useCallback } from 'react'

import useStore from '../../store'
import Lock from '../lock'
import { Box } from 'theme-ui'

const OFFSETS = {
  JAN: 0,
  APR: 3,
  JUL: 6,
  OCT: 9,
}

const MonthPicker = ({ sx }) => {
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

  return (
    <Box sx={{ position: 'relative' }}>
      <Select
        value={elapsedTime % 12}
        size='xs'
        disabled={disableMonthSelect}
        sx={{
          svg: {
            width: 12,
            height: 12,
            display: disableMonthSelect ? 'none' : 'inherit',
          },
          ...sx,
        }}
        sxSelect={{
          fontSize: 1,
          fontFamily: 'mono',
          letterSpacing: 'mono',
          transition: 'color 0.2s, border-color 0.2s',
          textTransform: 'uppercase',
          pr: 20,
          pb: '4px',
          cursor: disableMonthSelect ? 'not-allowed' : 'cursor',
          background: 'none',
        }}
        onChange={(e) => handleMonthChange(parseInt(e.target.value))}
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </Select>
      <Lock
        display={disableMonthSelect}
        sx={{ right: '-2px', top: '1px', svg: { width: 12, height: 12 } }}
      />
    </Box>
  )
}

export default MonthPicker
