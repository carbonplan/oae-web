import React, { useCallback, useMemo } from 'react'
import { Box, Checkbox, Flex, Label } from 'theme-ui'
import { Column, Filter, Select, Row, Colorbar } from '@carbonplan/components'

import TooltipWrapper from './tooltip'
import useStore, { variables } from '../store'
import { Chart, TickLabels, Ticks } from '@carbonplan/charts'
import { generateLogTicks, useVariableColormap } from '../utils/color'
import { formatValue } from '../utils/format'

const DESCRIPTIONS = {
  EFFICIENCY: {
    overview:
      'CO₂ removed per unit of alkalinity added. Higher values indicate more efficient carbon removal. Select a region to view additional experimental outputs.',
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
  FG: {
    region:
      'The movement of carbon dioxide between the atmosphere and the ocean. Negative values indicate ocean CO₂ uptake.',
  },
  Omega_arag: {
    region:
      'The saturation state of surface seawater with respect to aragonite . Aragonite is a type of calcium carbonate (CaCO₃) that is precipitated by many shell-forming marine organisms. A value of more than 1 indicates supersaturation, which supports the growth of calcifying organisms and indicates a higher likelihood of abiotic mineral precipitation.',
  },
  Omega_calc: {
    region:
      'The saturation state of surface seawater with respect to calcite, which is a type of calcium carbonate (CaCO₃). A value greater than 1 indicates supersaturation, which supports the growth of calcifying organisms and indicates a higher likelihood of abiotic mineral precipitation.',
  },
  PH: {
    region:
      'The measurement of acidity, or free hydrogen ions, in surface waters. The lower the pH value, the more acidic the seawater.',
  },
  pCO2SURF: {
    region:
      'The partial pressure of carbon dioxide at the ocean surface, a measure of how much CO₂ is dissolved in seawater. Ocean carbon uptake happens when the surface ocean pCO₂ is lower than the partial pressure of CO₂ in the overlying atmosphere',
  },
}

const DisplaySection = ({ sx }) => {
  const hasSelectedRegion = useStore(
    (state) => typeof state.selectedRegion === 'number'
  )
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
  const colormap = useVariableColormap()

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
    if (!hasSelectedRegion) {
      return Object.keys(variables).reduce((acc, key) => {
        if (variables[key].overview) {
          acc[key] = variables[key]
        }
        return acc
      }, {})
    } else {
      return variables
    }
  }, [hasSelectedRegion])

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
              <optgroup label='Overview variables'>
                {Object.keys(variables).map((variable) =>
                  variables[variable].overview ? (
                    <option
                      disabled={!selectVariables[variable]}
                      key={variable}
                      value={variable}
                    >
                      {variables[variable].label}
                    </option>
                  ) : null
                )}
              </optgroup>
              <optgroup label='Region-specific variables'>
                {Object.keys(variables).map((variable) =>
                  !variables[variable].overview ? (
                    <option
                      disabled={!selectVariables[variable]}
                      key={variable}
                      value={variable}
                    >
                      {variables[variable].label}
                    </option>
                  ) : null
                )}
              </optgroup>
            </Select>
            <Box
              id='description'
              sx={{
                fontSize: [0, 0, 0, 1],
                color: 'secondary',
                transition: 'all 0.2s',
              }}
            >
              {
                DESCRIPTIONS[variableFamily][
                  hasSelectedRegion ? 'region' : 'overview'
                ]
              }
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            {Object.keys(filterValues).length &&
              variables[variableFamily].optionsTooltip && (
                <TooltipWrapper
                  sx={{ justifyContent: 'flex-start', gap: 2 }}
                  tooltip={variables[variableFamily].optionsTooltip}
                >
                  <Filter
                    key={variableFamily}
                    values={filterValues}
                    setValues={handleVariableSelection}
                  />
                </TooltipWrapper>
              )}
          </Box>
        </Column>

        <Column start={1} width={[6, 8, 4, 4]} sx={{ ...sx.label, mt: 4 }}>
          <Flex sx={{ justifyContent: 'space-between', height: 25 }}>
            <Box>
              Color range{' '}
              {currentVariable.unit && (
                <>
                  (
                  <Box as='span' sx={{ textTransform: 'none' }}>
                    {currentVariable.unit}
                  </Box>
                  )
                </>
              )}
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
            <TickLabels
              values={logScale ? logLabels : null}
              format={(d) => formatValue(d, { 0.001: '.0e' })}
              sx={{ textTransform: 'none' }}
              bottom
            />
          </Chart>
        </Column>
      </Row>
    </>
  )
}

export default DisplaySection
