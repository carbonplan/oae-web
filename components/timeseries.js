import React, { useState } from 'react'
import { Box } from 'theme-ui'
import {
  AxisLabel,
  Chart,
  Circle,
  Grid,
  Line,
  Plot,
  Rect,
  TickLabels,
  Ticks,
} from '@carbonplan/charts'
import useStore from '../store'

const Timeseries = ({
  endYear,
  xLimits,
  yLimits,
  yLabels,
  timeData,
  handleClick,
  handleHover,
  point,
  xSelector = false,
  handleXSelectorClick = () => {},
}) => {
  const { selectedLines, unselectedLines, hoveredLine } = timeData
  const [mousePosition, setMousePosition] = useState(null)
  const [isHovering, setIsHovering] = useState(false)
  const [xSelectorValue, setXSelectorValue] = useState(null)
  const currentVariable = useStore((s) => s.currentVariable)

  const xYearsMonth = (x) => {
    const years = Math.floor(x)
    const months = Math.round((x - years) * 12)
    return `${years.toString().padStart(2, '0')}y${months
      .toString()
      .padStart(2, '0')}m`
  }

  const handleXSelectorMouseMove = (e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const clickX = Math.max(e.clientX - left, 0)
    const months = Math.round((clickX / width) * 179)
    const years = months / 12
    setMousePosition(years)
    setXSelectorValue(selectedLines[0]?.data?.[months]?.[1])
  }

  const handleXSelectorMouseEnter = () => {
    setIsHovering(true)
  }

  const handleXSelectorMouseLeave = () => {
    setIsHovering(false)
    setMousePosition(null)
    setXSelectorValue(null)
  }

  const xSelectorHandlers = xSelector
    ? {
        onMouseMove: handleXSelectorMouseMove,
        onMouseEnter: handleXSelectorMouseEnter,
        onMouseLeave: handleXSelectorMouseLeave,
        onClick: handleXSelectorClick,
      }
    : {}

  const renderXSelector = (x, selected) => {
    if ((!selected && !isHovering) || !xSelector) return null
    const color = selected ? 'primary' : 'secondary'
    return (
      <Line
        data={[
          [x, 0],
          [x, yLimits[1]],
        ]}
        strokeWidth={1}
        color={color}
        opacity={1}
      />
    )
  }

  const renderHoveredLine = () => {
    if (!hoveredLine) {
      return null
    }
    const { color } = hoveredLine
    return (
      <Line
        key={hoveredLine.id + '-hovered'}
        onClick={() => handleClick(hoveredLine.id)}
        sx={{
          stroke: color,
          strokeWidth: 4,
          pointerEvents: 'none',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        data={hoveredLine.data}
      />
    )
  }

  const renderPoint = (point) => {
    const { x, y, color } = point
    return (
      <Circle
        x={x}
        y={y}
        size={10}
        color={color}
        sx={{ pointerEvents: 'none' }}
      />
    )
  }

  const renderTimeAndData = () => {
    const isXSelectorAvailable =
      !!xSelector &&
      mousePosition !== null &&
      isHovering &&
      xSelectorValue !== null
    const isPointAvailable = point?.y !== undefined
    const formattedYValue = () => {
      if (xSelectorValue !== null) {
        return xSelectorValue.toFixed(currentVariable?.calc ? 3 : 1)
      } else if (point?.y) {
        return point.y.toFixed(currentVariable?.calc ? 3 : 1)
      }
      return ''
    }
    if (formattedYValue() === '') return null
    const shouldDisplayBox = isXSelectorAvailable || isPointAvailable
    const xValue = mousePosition ?? point?.x
    const boxContent = `${xYearsMonth(xValue)}, ${formattedYValue()}`

    return shouldDisplayBox ? (
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          fontFamily: 'mono',
          fontSize: 1,
          color: 'secondary',
          pointerEvents: 'none',
        }}
      >
        ({boxContent}
        <Box as='span' sx={{ fontSize: 0 }}>
          {currentVariable.unit}
        </Box>
        )
      </Box>
    ) : null
  }

  return (
    <Box
      sx={{
        zIndex: 0,
        position: 'relative',
        width: '100%',
        height: '300px',
        pointerEvents: 'none',
      }}
    >
      {renderTimeAndData()}
      <Chart x={xLimits} y={yLimits} padding={{ top: 30 }}>
        <Grid vertical horizontal />
        <Ticks left bottom />
        <TickLabels left bottom />
        <AxisLabel units={yLabels.units} sx={{ fontSize: 0 }} left>
          {yLabels.title}
        </AxisLabel>
        <AxisLabel units='years' sx={{ fontSize: 0 }} bottom>
          Time
        </AxisLabel>
        <Plot
          sx={{
            pointerEvents: 'auto',
            cursor:
              xSelector && mousePosition && mousePosition < endYear
                ? 'pointer'
                : 'auto',
          }}
          {...xSelectorHandlers}
        >
          {xSelector && mousePosition && renderXSelector(mousePosition, false)}
          {point?.x && renderXSelector(point.x, true)}
          {selectedLines.map(({ data, id, color }) => (
            <Line
              key={id + '-selected'}
              id={id + '-selected'}
              onClick={handleClick}
              onMouseOver={() => handleHover(id)}
              onMouseLeave={() => handleHover(null)}
              sx={{
                stroke: color,
                strokeWidth: 2,
                pointerEvents: 'visiblePainted',
                '&:hover': {
                  cursor: 'pointer',
                },
                transition: 'all 0.2s',
              }}
              data={data}
            />
          ))}
          {unselectedLines.map(({ data, id, color }) => (
            <Line
              key={id + '-unselected'}
              id={id + '-unselected'}
              sx={{
                stroke: color,
                strokeWidth: 2,
                transition: 'all 0.2s',
              }}
              data={data}
            />
          ))}
          <Rect
            x={[endYear, 15]}
            y={[0, 1000000]}
            color='muted'
            opacity={0.2}
            onClick={(e) => e.stopPropagation()}
          />
          {renderHoveredLine()}
          {xSelectorValue
            ? renderPoint({
                x: mousePosition,
                y: xSelectorValue,
                color: 'secondary',
              })
            : null}
          {point && renderPoint(point)}
        </Plot>
      </Chart>
    </Box>
  )
}

export default Timeseries
