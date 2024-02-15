import React, { useMemo } from 'react'
import { Box, Divider } from 'theme-ui'
import { Expander, Select } from '@carbonplan/components'
import AnimateHeight from 'react-animate-height'
import { useThemedColormap } from '@carbonplan/colormaps'
import { useRegion } from '@carbonplan/maps'

import TimeSlider from './time-slider'
import Timeseries from './timeseries'
import useStore, { variables } from '../store'

const toMonthsIndex = (year, startYear) => (year - startYear) * 12

const RegionDetail = ({ sx }) => {
  const currentVariable = useStore((state) => state.currentVariable)
  const setCurrentVariable = useStore((state) => state.setCurrentVariable)
  const showRegionPicker = useStore((state) => state.showRegionPicker)
  const setShowRegionPicker = useStore((state) => state.setShowRegionPicker)
  const regionData = useStore((state) => state.regionData)
  const timeHorizon = useStore((state) => state.timeHorizon)

  const colormap = useThemedColormap(currentVariable?.colormap)
  const { region } = useRegion()
  const zoom = region?.properties?.zoom || 0

  const [minMax, setMinMax] = React.useState([0, 0])

  const degToRad = (degrees) => {
    return degrees * (Math.PI / 180)
  }
  const areaOfPixelProjected = (lat, zoom) => {
    const c = 40075016.686 / 1000
    return Math.pow(
      (c * Math.cos(degToRad(lat))) / Math.pow(2, Math.floor(zoom) + 7),
      2
    )
  }

  const isValidElement = (element) =>
    element !== 0 && element !== 9.969209968386869e36 && !isNaN(element)

  const getArrayData = (arr, lats, zoom) => {
    let totalArea = 0
    let weightedSum = 0

    const validIndexes = arr.reduce((valid, el, i) => {
      if (isValidElement(el)) {
        const area = areaOfPixelProjected(lats[i], zoom)
        valid.push(i)
        totalArea += area
        weightedSum += el * area
      }
      return valid
    }, [])

    const avg = validIndexes.length > 0 ? weightedSum / totalArea : 0

    return { avg }
  }

  const toLineData = useMemo(() => {
    if (!currentVariable || !regionData?.[currentVariable.key]) return []

    const averages = Object.values(regionData[currentVariable.key]).map(
      (data, index) => {
        const { avg } = getArrayData(data, regionData.coordinates.lat, zoom)
        const toYear = index / 12
        return [toYear, avg]
      }
    )
    // get min and max of averages
    const min = Math.min(...averages.map((a) => a[1]))
    const max = Math.max(...averages.map((a) => a[1]))
    setMinMax([min, max])
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
          yLimits={minMax}
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
