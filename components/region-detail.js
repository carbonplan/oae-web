import React, { useMemo } from 'react'
import { Box, Divider } from 'theme-ui'
import { Expander, Select } from '@carbonplan/components'
import TimeSlider from './time-slider'
import useStore, { variables } from '../store'
import AnimateHeight from 'react-animate-height'
import Timeseries from './timeseries'
import { useThemedColormap } from '@carbonplan/colormaps'

const toMonthsIndex = (year, startYear) => (year - startYear) * 12
const RegionDetail = ({ sx }) => {
  const currentVariable = useStore((state) => state.currentVariable)
  const setCurrentVariable = useStore((state) => state.setCurrentVariable)
  const showRegionPicker = useStore((state) => state.showRegionPicker)
  const setShowRegionPicker = useStore((state) => state.setShowRegionPicker)
  const regionData = useStore((state) => state.regionData)
  const timeHorizon = useStore((state) => state.timeHorizon)

  const colormap = useThemedColormap(currentVariable?.colormap)

  const toLineData = useMemo(() => {
    if (!currentVariable || !regionData?.[currentVariable.key]) return []
    const averages = Object.values(regionData[currentVariable.key]).map(
      (data, index) => {
        const { sum, count } = data.reduce(
          (acc, value) => {
            if (value !== 0 && value !== 9.969209968386869e36) {
              acc.sum += value
              acc.count += 1
            }
            return acc
          },
          { sum: 0, count: 0 }
        )
        const avgData = count > 0 ? sum / count : 0
        const toYear = index / 12
        return [toYear, avgData]
      }
    )
    return [averages]
  }, [regionData, currentVariable])

  const { selectedLines, unselectedLines } = useMemo(() => {
    const selectedLines = []
    const unselectedLines = []
    toLineData.forEach((line, index) => {
      const cutIndex = toMonthsIndex(timeHorizon, 0)
      selectedLines.push({ id: index, data: line.slice(0, cutIndex + 1) })
      unselectedLines.push({ id: index, data: line.slice(cutIndex + 1) })
    })
    return { selectedLines, unselectedLines }
  }, [regionData, timeHorizon, toMonthsIndex])
  const hoveredLine = null

  const handleSelection = (e) => {
    const selectedVariable = variables.find(
      (variable) => variable.key === e.target.value
    )
    setCurrentVariable(selectedVariable)
  }

  return (
    <>
      <Divider sx={{ mt: 4, mb: 5 }} />
      <Box sx={sx.heading}>Variables</Box>
      <Select
        onChange={handleSelection}
        value={currentVariable.key}
        size='xs'
        sx={{
          width: '100%',
          mt: 2,
        }}
        sxSelect={{
          fontFamily: 'mono',
          width: '100%',
          mt: 2,
        }}
      >
        {variables.map((variable) => (
          <option key={variable.key} value={variable.key}>
            {variable.label}
          </option>
        ))}
      </Select>
      <Box sx={{ mb: [-3, -3, -3, -2], mt: 4 }}>
        <TimeSlider />
      </Box>
      <Divider sx={{ mt: 4, mb: 5 }} />
      <Box
        onClick={() => setShowRegionPicker(!showRegionPicker)}
        sx={{
          ...sx.heading,
          cursor: 'pointer',
          '&:hover #expander': {
            stroke: 'primary',
          },
        }}
      >
        Time Series
        <Expander
          id='expander'
          value={showRegionPicker}
          sx={{ width: 20, ml: 2 }}
        />
      </Box>
      <AnimateHeight duration={500} height={showRegionPicker ? 'auto' : 0}>
        <Timeseries
          endYear={timeHorizon}
          xLimits={[0, 15]}
          yLimits={currentVariable.colorLimits}
          yLabels={{
            title: currentVariable.label ?? '',
            units: currentVariable.unit ?? '',
          }}
          timeData={{ selectedLines, unselectedLines, hoveredLine }}
          colormap={colormap}
          colorLimits={currentVariable.colorLimits}
          handleClick={() => {}}
          handleHover={() => {}}
          hoveredRegion={null}
        />
      </AnimateHeight>
    </>
  )
}

export default RegionDetail
