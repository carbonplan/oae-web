import React, { useState } from 'react'
import { Box } from 'theme-ui'
import {
  AxisLabel,
  Chart,
  Grid,
  Line,
  Plot,
  Point,
  Rect,
  Scatter,
  TickLabels,
  Ticks,
} from '@carbonplan/charts'
import { Badge } from '@carbonplan/components'
import { useSpring, animated, easings } from 'react-spring'

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

  const animatedYLimits = useSpring({
    yLimits,
    from: { yLimits: [0, 1] },
    config: {
      duration: 300,
      easing: easings.easeOut,
    },
  })
  const AnimatedChart = animated(Chart)

  const handleXSelectorMouseMove = (e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - left
    const years = ((clickX / width) * 180) / 12
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
      <Scatter
        sx={{ pointerEvents: 'none' }}
        color={color}
        size={10}
        x={(d) => d.x}
        y={(d) => d.y}
        data={[
          {
            x: x,
            y: y,
          },
        ]}
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
    <Box sx={{ zIndex: 0, position: 'relative' }}>
      <Box sx={{ width: '100%', height: '300px', pointerEvents: 'none' }}>
        <AnimatedChart
          x={xLimits}
          y={animatedYLimits.yLimits}
          padding={{ top: 30 }}
        >
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
            {selectedLines.map((line, i) => (
              <Line
                key={i + '-selected'}
                id={line.id}
                onClick={handleClick}
                onMouseOver={() => handleHover(line.id)}
                onMouseLeave={() => handleHover(null)}
                sx={{
                  stroke: line.color,
                  strokeWidth: 2,
                  pointerEvents: 'visiblePainted',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                data={line.data}
              />
            ))}
            {unselectedLines.map((line, i) => (
              <Line
                key={i + '-unselected'}
                sx={{
                  stroke: line.color,
                  strokeWidth: 2,
                }}
                data={line.data}
              />
            ))}
            <Rect
              x={[endYear, 15]}
              y={[0, 1000000]}
              color='muted'
              opacity={0.2}
              onClick={(e) => e.stopPropagation()}
            />
            {xSelector &&
              isHovering &&
              mousePosition &&
              mousePosition < endYear && (
                <Rect
                  x={[mousePosition, mousePosition + 0.05]}
                  y={yLimits}
                  color='secondary'
                  opacity={1}
                />
              )}
            {renderHoveredLine()}
            {renderPoint()}
          </Plot>
          {renderDataBadge()}
        </AnimatedChart>
      </Box>
    </Box>
  )
}

export default Timeseries
