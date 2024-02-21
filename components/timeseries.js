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
  }

  const handleXSelectorMouseEnter = () => {
    setIsHovering(true)
  }

  const handleXSelectorMouseLeave = () => {
    setIsHovering(false)
    setMousePosition(null)
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
        <Rect
          x={[mousePosition - 0.02, mousePosition + 0.02]}
          y={yLimits}
          color='none'
          stroke={theme.colors.secondary}
          strokeWidth={0.3}
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

  const renderPoint = () => {
    if (!point) return null
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

  const renderDataBadge = () => {
    if (!point || !point.text) return null
    const { x, y, color, text } = point
    return (
      <Point x={x} y={y} align={'center'} width={2}>
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
          {renderPoint()}
          {renderXSelector()}
        </Plot>
        {renderXSelectorLabel()}
        {renderDataBadge()}
      </Chart>
    </Box>
  )
}

export default Timeseries
