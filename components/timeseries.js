import React, { useState } from 'react'
import { Box, Spinner } from 'theme-ui'
import { format } from 'd3-format'
import { alpha } from '@theme-ui/color'
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

const formatValue = (value) => {
  const test = Math.abs(value)
  if (test === 0) {
    return 0
  } else if (test < 0.0001) {
    return format('.1e')(value)
  } else if (test < 0.01) {
    return format('.2')(value)
  } else if (test < 1) {
    return format('.2f')(value)
  } else if (test < 10) {
    return format('.1f')(value)
  } else if (test < 10000) {
    return format('.0f')(value)
  } else {
    return format('0.2s')(value)
  }
}

const renderPoint = (point) => {
  const { x, y, color } = point
  if (x === undefined || y === undefined || color === undefined) return null
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
  if (!point || !point.text) return null
  const { x, y, color, text } = point
  const fullColor = alpha(color, 1)
  return (
    <Point x={x} y={y} align={'center'} width={2}>
      <Badge
        sx={{
          fontSize: 1,
          height: '20px',
          mt: 2,
          bg: fullColor,
        }}
      >
        {text}
      </Badge>
    </Point>
  )
}

const ColormapGradient = ({ colormap, opacity = 1 }) => {
  return (
    <defs>
      <linearGradient
        id='colormapGradient'
        x1='0%'
        y1='100%'
        x2='0%'
        y2='0%'
        gradientUnits='userSpaceOnUse'
      >
        {colormap.map((rgb, index) => {
          const offset = index / (colormap.length - 1)
          return (
            <stop
              key={index}
              offset={`${offset * 100}%`}
              stopColor={`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`}
              stopOpacity={opacity}
            />
          )
        })}
      </linearGradient>
    </defs>
  )
}

const RenderLines = ({
  linesObject = {},
  additionalStyles = {},
  handleClick,
  handleHover,
  gradient = false,
}) => {
  const lineCount = Object.keys(linesObject).length
  const interactive = handleClick || handleHover
  return Object.values(linesObject).map(({ id, data, color, strokeWidth }) => (
    <Line
      key={id}
      data={data}
      id={id}
      width={strokeWidth}
      color={gradient ? 'url(#colormapGradient)' : color}
      sx={{
        pointerEvents: 'visiblePainted',
        '&:hover': {
          cursor: interactive ? 'pointer' : 'default',
        },
        shapeRendering: lineCount > 100 ? 'optimizeSpeed' : 'auto',
        ...additionalStyles,
      }}
      onClick={handleClick}
      onMouseOver={handleHover ? () => handleHover(id) : undefined}
      onMouseLeave={handleHover ? () => handleHover(null) : undefined}
    />
  ))
}

const ActiveLine = () => {
  const activeLineData = useStore((s) => s.activeLineData)
  const overviewElapsedTime = useStore((s) => s.overviewElapsedTime)

  if (!activeLineData || !activeLineData.data) {
    return null
  }

  const { activeColor, color } = activeLineData
  const x = activeLineData.data[overviewElapsedTime][0]
  const y = activeLineData.data[overviewElapsedTime][1]
  return (
    <>
      <Line
        sx={{
          stroke: activeColor ? activeColor : color,
          strokeWidth: 2,
          pointerEvents: 'none',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        data={activeLineData.data}
      />
      <Circle
        x={x}
        y={y}
        size={10}
        color={activeColor ? activeColor : color}
        sx={{ pointerEvents: 'none' }}
      />
    </>
  )
}

const OverviewBadge = () => {
  const activeLineData = useStore((s) => s.activeLineData)
  const overviewElapsedTime = useStore((s) => s.overviewElapsedTime)
  if (!activeLineData || !activeLineData.data) {
    return null
  }
  const { color } = activeLineData
  const data = activeLineData.data[overviewElapsedTime]
  const x = data[0]
  const y = data[1]
  const point = { x, y, color, text: data[1].toFixed(2) }
  return renderDataBadge(point)
}

const Timeseries = ({
  xLimits,
  yLimits,
  yLabels,
  selectedLines,
  handleClick,
  handleHover,
  point,
  elapsedYears,
  colormap,
  opacity,
  showActive = false,
  shadeHorizon = false,
  xSelector = false,
  handleXSelectorClick = () => {},
  logy = false,
  logLabels = [],
}) => {
  const regionDataLoading = useStore((s) => s.regionDataLoading)
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
    const year = Math.floor(x)
    return (
      <Rect
        id='x-selector'
        x={[year, year + 1]}
        y={[0, yLimits[1]]}
        color={color}
        opacity={0.1}
      />
    )
  }

  const renderTimeAndData = () => {
    if (!xSelector) return null
    const yValue = xSelectorValue ?? point?.y
    const xValue = mousePosition ?? point?.x
    if (yValue === undefined || xValue === undefined) return null
    return (
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
        ({xYearsMonth(xValue)}, {formatValue(yValue)}
        <Box as='span' sx={{ fontSize: 0 }}>
          {currentVariable.unit}
        </Box>
        )
      </Box>
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
      {renderTimeAndData()}
      <Chart x={xLimits} y={yLimits} logy={logy} padding={{ top: 30 }}>
        <Grid vertical horizontal />
        <Ticks left />
        <Ticks bottom values={Array.from({ length: 16 }, (_, i) => i)} />
        <TickLabels
          left
          values={logy && logLabels}
          format={(d) => {
            if (Math.abs(d) < 0.001 && d !== 0) {
              return d.toExponential(0)
            }
            return d
          }}
        />
        <TickLabels bottom values={[0, 5, 10, 15]} />
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
              (handleClick || handleHover) && xSelector && mousePosition
                ? 'pointer'
                : 'auto',
          }}
          {...xSelectorHandlers}
        >
          {colormap && (
            <ColormapGradient colormap={colormap} opacity={opacity} />
          )}
          <RenderLines
            linesObject={selectedLines}
            handleHover={handleHover}
            handleClick={handleClick}
            gradient={colormap ? true : false}
          />
          {shadeHorizon && (
            <Rect
              x={[elapsedYears, 15]}
              y={[0, yLimits[1]]}
              color='muted'
              pointerEvents='none'
              style={{
                transition: 'all 0.2s ease-in-out',
                opacity: 0.3,
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {showActive && <ActiveLine />}
          {xSelector && mousePosition && renderXSelector(mousePosition, false)}
          {point && renderPoint(point)}
        </Plot>
        {!xSelector && renderDataBadge()}
        {showActive && <OverviewBadge />}
        {regionDataLoading && xSelector && (
          <Box
            sx={{
              position: 'absolute',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              ml: 5,
            }}
          >
            <Spinner size={28} />
          </Box>
        )}
      </Chart>
    </Box>
  )
}

export default Timeseries
