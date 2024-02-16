import React from 'react'
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

const Timeseries = ({
  endYear,
  xLimits,
  yLimits,
  yLabels,
  timeData,
  handleClick,
  handleHover,
  point,
}) => {
  const { selectedLines, unselectedLines, hoveredLine } = timeData

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
          <Plot>
            {selectedLines.map((line, i) => (
              <Line
                key={i + '-selected'}
                onClick={() => handleClick(line.id)}
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
                onClick={() => handleClick(line.id)}
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
            <Rect x={[endYear, 15]} y={yLimits} color='muted' opacity={0.2} />
            {renderHoveredLine()}
            {renderPoint()}
          </Plot>
          {renderDataBadge()}
        </Chart>
      </Box>
    </Box>
  )
}

export default Timeseries
