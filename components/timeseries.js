import React, { useState } from 'react'
import { Box, useThemeUI } from 'theme-ui'
import {
  AxisLabel,
  Chart,
  Circle,
  Grid,
  Line,
  Plot,
  Point,
  Rect,
  TickLabels,
  Ticks,
} from '@carbonplan/charts'
import { Badge } from '@carbonplan/components'
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
  const { theme } = useThemeUI()
  const { selectedLines, unselectedLines, hoveredLine } = timeData
  const [mousePosition, setMousePosition] = useState(null)
  const [isHovering, setIsHovering] = useState(false)
  const [xSelectorValue, setXSelectorValue] = useState(null)
  const currentVariable = useStore((s) => s.currentVariable)

  const xYearsMonth = (x) => {
    const years = Math.floor(x)
    const months = Math.round((x - years) * 12)
    return years > 0 ? `${years}y ${months}m` : `${months}m`
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

  const renderXSelector = () => {
    if (
      xSelector &&
      isHovering &&
      mousePosition != null &&
      mousePosition < endYear
    ) {
      return (
        <Line
          data={[
            [mousePosition, 0],
            [mousePosition, yLimits[1]],
          ]}
          strokeWidth={1}
          color='secondary'
          opacity={1}
        />
      )
    }
  }

  const renderXSelectorLabel = () => {
    if (
      !isHovering ||
      mousePosition == null ||
      mousePosition >= endYear ||
      !selectedLines.length
    ) {
      return null
    }
    return (
      <Point
        x={mousePosition}
        y={yLimits[1]}
        align={mousePosition < 12 ? 'left' : 'right'}
        verticalAlign='bottom'
        height={20}
      >
        <Box sx={{ mb: -2, [mousePosition < 12 ? 'ml' : 'mr']: -2 }}>
          <Badge
            sx={{
              fontSize: 0,
              height: '20px',
              background: 'secondary',
            }}
          >
            {xYearsMonth(mousePosition)}
          </Badge>
        </Box>
      </Point>
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

  const renderDataBadge = (point) => {
    const { text, x, y, color } = point
    return (
      <Point x={x} y={y} align='center' width={2}>
        <Badge
          sx={{
            fontSize: 1,
            height: '20px',
            mt: 2,
            bg: color,
          }}
        >
          {text}
        </Badge>
      </Point>
    )
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
          {point && renderPoint(point)}
          {xSelectorValue
            ? renderPoint({
                x: mousePosition,
                y: xSelectorValue,
                color: 'secondary',
              })
            : null}
          {renderXSelector()}
        </Plot>
        {renderXSelectorLabel()}
        {point && renderDataBadge(point)}
        {xSelectorValue
          ? renderDataBadge({
              x: mousePosition,
              y: xSelectorValue,
              color: 'secondary',
              text: xSelectorValue.toFixed(currentVariable.calc ? 3 : 1),
            })
          : null}
      </Chart>
    </Box>
  )
}

export default Timeseries
