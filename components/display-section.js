import React, { useCallback, useMemo } from 'react'
import { Box, Checkbox, Flex, Label } from 'theme-ui'
import { Column, Filter, Select, Row, Colorbar } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'

import TooltipWrapper from './tooltip'
import useStore, { variables } from '../store'
import { Chart, TickLabels, Ticks } from '@carbonplan/charts'
import { generateLogTicks } from '../utils/color'

const DESCRIPTIONS = {
  EFFICIENCY: {
    overview:
      'Carbon removal efficiency of release as a function of region, injection month, and elapsed time. Select a region to view additional experimental outputs.',
    region:
      'Carbon removal efficiency of release as a function of region, injection month, and elapsed time.',
  },
  FG_CO2: {
    overview:
      'Percentage of cumulative CO₂ uptake taking place within the specified distance from the center of the injection region. Select a region to view additional experimental outputs.',
    region:
      'Percentage of cumulative CO₂ uptake taking place within the specified distance from the center of the injection region.',
  },
  ALK: {
    region:
      'Concentration of alkalinity in surface waters. Alkalinity increases the ocean’s ability to absorb carbon.',
  },
  DIC: {
    region:
      'Dissolved inorganic carbon (DIC) is the sum of inorganic carbon in water. Full water column values shown here.',
  },
}

const DisplaySection = ({ sx }) => {
  const selectedRegion = useStore((state) => state.selectedRegion)
  const currentVariable = useStore((s) => s.currentVariable)
  const setCurrentVariable = useStore((s) => s.setCurrentVariable)
  const variableFamily = useStore((s) => s.variableFamily)
  const setVariableFamily = useStore((s) => s.setVariableFamily)
  const logScale = useStore((s) => s.logScale && s.currentVariable.logScale)
  const setLogScale = useStore((s) => s.setLogScale)

  const min = logScale
    ? currentVariable.logColorLimits[0]
    : currentVariable.colorLimits[0]
  const max = logScale
    ? currentVariable.logColorLimits[1]
    : currentVariable.colorLimits[1]
  const logLabels = logScale ? generateLogTicks(min, max) : null
  const colormap = logScale
    ? useThemedColormap(currentVariable.colormap, {
        count: logLabels.length,
      }).slice(1, logLabels.length)
    : useThemedColormap(currentVariable.colormap)

  const filterValues = useMemo(() => {
    return variables[variableFamily].variables.reduce(
      (acc, variable) => ({
        ...acc,
        [variable.label]: currentVariable.label === variable.label,
      }),
      {}
    )
  }, [variableFamily, currentVariable])

  const selectVariables = useMemo(() => {
    if (selectedRegion === null) {
      return Object.keys(variables).reduce((acc, key) => {
        if (variables[key].overview) {
          acc[key] = variables[key]
        }
        return acc
      }, {})
    } else {
      return variables
    }
  }, [selectedRegion])

  const handleFamilySelection = useCallback(
    (e) => {
      setVariableFamily(e.target.value)
      setCurrentVariable(variables[e.target.value].variables[0])
    },
    [setVariableFamily, setCurrentVariable, variables]
  )

  const handleVariableSelection = useCallback(
    (updatedValues) => {
      const selectedLabel = Object.keys(updatedValues).find(
        (label) => updatedValues[label]
      )
      if (selectedLabel) {
        const selectedVariable = variables[variableFamily].variables.find(
          (variable) => variable.label === selectedLabel
        )
        if (selectedVariable) {
          setCurrentVariable(selectedVariable)
        }
      }
    },
    [variableFamily, setCurrentVariable]
  )

  return (
    <>
      <Box sx={sx.heading}>Display</Box>
      <Row columns={[6, 8, 4, 4]} sx={{ mt: 3 }}>
        <Column start={1} width={[2, 2, 1, 1]} sx={sx.label}>
          Variable
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]}>
          <Box sx={{ position: 'relative' }}>
            <Select
              onChange={handleFamilySelection}
              value={variableFamily}
              size='xs'
              sx={{
                width: '100%',
                mr: 2,
                mb: 1,
              }}
              sxSelect={{
                fontFamily: 'mono',
                width: '100%',
              }}
            >
              {Object.keys(selectVariables).map((variable) => (
                <option key={variable} value={variable}>
                  {variables[variable].label}
                </option>
              ))}
            </Select>
            <Box
              id='description'
              sx={{
                fontSize: 0,
                color: 'secondary',
                transition: 'all 0.2s',
              }}
            >
              {
                DESCRIPTIONS[variableFamily][
                  selectedRegion ? 'region' : 'overview'
                ]
              }
            </Box>
          </Box>
          <Box sx={{ mt: 3, minHeight: 30 }}>
            {variables[variableFamily].optionsTooltip && (
              <TooltipWrapper
                sx={{ justifyContent: 'flex-start', gap: 2 }}
                tooltip={variables[variableFamily].optionsTooltip}
              >
                {Object.keys(filterValues).length && (
                  <Filter
                    key={variableFamily}
                    values={filterValues}
                    setValues={handleVariableSelection}
                  />
                )}
              </TooltipWrapper>
            )}
          </Box>
        </Column>

        <Column start={1} width={[6, 8, 4, 4]} sx={{ ...sx.label, mt: 4 }}>
          <Flex sx={{ justifyContent: 'space-between', height: 25 }}>
            <Box>
              Color range (
              <Box as='span' sx={{ textTransform: 'none' }}>
                {currentVariable.unit}
              </Box>
              )
            </Box>
            <Box>
              {currentVariable.logScale && (
                <Label
                  sx={{
                    cursor: 'pointer',
                    textTransform: 'none',
                    color: 'secondary',
                  }}
                >
                  <Checkbox
                    checked={logScale}
                    onChange={(e) => setLogScale(e.target.checked)}
                    sx={{
                      width: 18,
                      mr: 1,
                      mt: '-3px',
                      color: 'secondary',
                      transition: 'color 0.15s',
                      'input:active ~ &': {
                        bg: 'background',
                        color: 'primary',
                      },
                      'input:focus ~ &': {
                        bg: 'background',
                        color: logScale ? 'primary' : 'muted',
                      },
                      'input:hover ~ &': {
                        bg: 'background',
                        color: 'primary',
                      },
                      'input:focus-visible ~ &': {
                        outline: 'dashed 1px rgb(110, 110, 110, 0.625)',
                        background: 'rgb(110, 110, 110, 0.625)',
                      },
                    }}
                  />
                  Log scale
                </Label>
              )}
            </Box>
          </Flex>
        </Column>
        <Column start={[1]} width={[6, 8, 4, 4]} sx={{ mb: 2 }}>
          <Colorbar
            colormap={colormap}
            discrete={logScale}
            horizontal
            width={'100%'}
            sx={{ mt: 2 }}
          />
        </Column>
      </Row>
      <Row columns={[6, 8, 4, 4]} sx={{ mt: '9px' }}>
        <Column start={1} width={[6, 8, 4, 4]} sx={{ ...sx.label, mt: 5 }}>
          <Chart
            logx={logScale}
            x={[min, max]}
            y={[0, 0]}
            padding={{ left: 1 }}
          >
            <Ticks
              values={logScale ? logLabels : null}
              bottom
              sx={{
                '&:first-of-type': { ml: '-1px' },
              }}
            />
            <TickLabels values={logScale ? logLabels : null} bottom />
          </Chart>
        </Column>
      </Row>
    </>
  )
}

export default DisplaySection
