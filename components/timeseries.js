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
  timeData,
  colormap,
  colorLimits,
  hoveredRegion,
  handleClick,
  handleHover,
}) => {
  const { selectedLines, unselectedLines, hoveredLine } = timeData
  console.log('selectedLines', selectedLines)
  console.log('unselectedLines', unselectedLines)

  const renderHoveredLine = () => {
    if (!hoveredLine) {
      return null
    }
    const color = getColorForValue(hoveredLine.data.slice(-1)[0][1])

    return (
      <>
        <Line
          key={hoveredRegion + '-hovered'}
          onClick={() => handleClick(hoveredRegion)}
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
        <Scatter
          sx={{ pointerEvents: 'none' }}
          color={color}
          size={10}
          x={(d) => d.x}
          y={(d) => d.y}
          data={[
            {
              x: endYear,
              y: hoveredLine.data.slice(-1)[0][1],
            },
          ]}
        />
      </>
    )
  }

  const renderDataBadge = () => {
    if (!hoveredLine) {
      return null
    }
    const lastDataPoint = hoveredLine?.data.slice(-1)[0]
    const y = lastDataPoint[1]
    return (
      <Point x={endYear} y={y} align={'center'} width={2}>
        <Badge
          sx={{
            fontSize: 1,
            height: '20px',
            mt: 2,
            bg: getColorForValue(y),
          }}
        >
          {y.toFixed(2)}
        </Badge>
      </Point>
    )
  }

  const getColorForValue = (value) => {
    let scaledValue =
      (value - colorLimits[0]) / (colorLimits[1] - colorLimits[0])
    scaledValue = Math.max(0, Math.min(1, scaledValue))
    const index = Math.floor(scaledValue * (colormap.length - 1))
    if (!colormap[index]) {
      return 'rgba(0,0,0,0)'
    }
    // convert rgb array to string
    if (colormap[index]?.length === 3) {
      return `rgb(${colormap[index].join(',')})`
    }
    return colormap[index]
  }

  return (
    <Box sx={{ zIndex: 0, position: 'relative' }}>
      <Box sx={{ width: '100%', height: '300px', pointerEvents: 'none' }}>
        <Chart x={xLimits} y={yLimits} padding={{ left: 60, top: 50 }}>
          <Grid vertical horizontal />
          <Ticks left bottom />
          <TickLabels left bottom />
          <AxisLabel sx={{ fontSize: 0 }} left>
            OAE efficiency
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
                  stroke: getColorForValue(line.data?.slice(-1)?.[0]?.[1]),
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
                  stroke: 'muted',
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
          </Plot>
          {renderDataBadge()}
        </Chart>
      </Box>
    </Box>
  )
}

export default Timeseries
