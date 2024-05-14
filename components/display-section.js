import React, { useCallback, useMemo } from 'react'
import { Box } from 'theme-ui'
import { Column, Filter, Select, Row, Colorbar } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'

import TooltipWrapper from './tooltip'
import useStore, { variables } from '../store'

const DESCRIPTIONS = {
  EFFICIENCY: {
    overview:
      'Overall efficiency of release. Select a region to view other experimental outputs.',
    region: 'Overall efficiency of release.',
  },
  ALK: {
    region:
      "Concentration of alkalinity in water. Higher alkalinity concentration correlates with increases in the ocean's ability to absorb carbon.",
  },
  DIC: {
    region:
      'DIC (mmol/m³) is the sum of inorganic carbon in water. It is a measure of how much carbon is stored in the ocean.',
  },
}

const DisplaySection = ({ sx }) => {
  const selectedRegion = useStore((state) => state.selectedRegion)
  const currentVariable = useStore((s) => s.currentVariable)
  const setCurrentVariable = useStore((s) => s.setCurrentVariable)
  const variableFamily = useStore((s) => s.variableFamily)
  const setVariableFamily = useStore((s) => s.setVariableFamily)
  const colormap = useThemedColormap(currentVariable.colormap)

  const filterValues = useMemo(() => {
    return variables[variableFamily].variables.reduce(
      (acc, variable, index) => ({
        ...acc,
        [variable.label]: currentVariable.label === variable.label,
      }),
      {}
    )
  }, [variableFamily, currentVariable])

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
              disabled={!selectedRegion}
              onChange={handleFamilySelection}
              value={variableFamily}
              size='xs'
              sx={{
                width: '100%',
                mr: 2,
                mb: 1,
                '&:hover ~ #description': selectedRegion
                  ? {}
                  : {
                      color: 'primary',
                    },
                '&:hover ~ #lock-container': selectedRegion
                  ? {}
                  : {
                      color: 'primary',
                    },
              }}
              sxSelect={{
                fontFamily: 'mono',
                width: '100%',
              }}
            >
              {Object.keys(variables).map((variable) => (
                <option key={variable} value={variable}>
                  {variables[variable].meta.label}
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
            <Box
              id='lock-container'
              sx={{
                position: 'absolute',
                right: 0,
                top: '2px',
                background: 'background',
                pointerEvents: 'none',
                color: 'secondary',
                transition: 'all 0.2s',
              }}
            >
              <Box
                as='svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                sx={{ width: [14, 14, 14, 14], height: [14, 14, 14, 16] }}
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M10.5 1C8.01472 1 6 3.01472 6 5.5V8H4V21C4 22.1046 4.89543 23 6 23H18C19.1046 23 20 22.1046 20 21V8H18V5.5C18 3.01472 15.9853 1 13.5 1H10.5ZM16 8V5.5C16 4.11929 14.8807 3 13.5 3H10.5C9.11929 3 8 4.11929 8 5.5V8H16Z'
                />
              </Box>
            </Box>
          </Box>

          {currentVariable.key !== 'EFFICIENCY' && (
            <Box sx={{ mt: 3 }}>
              <TooltipWrapper
                sx={{ justifyContent: 'flex-start', gap: 2 }}
                tooltip='Toggle between a view of the shift in the selected variable and its total values.'
              >
                {Object.keys(filterValues).length && (
                  <Filter
                    key={variableFamily}
                    values={filterValues}
                    setValues={handleVariableSelection}
                  />
                )}
              </TooltipWrapper>
            </Box>
          )}
        </Column>

        <Column start={1} width={[6, 8, 4, 4]} sx={{ ...sx.label, mt: 4 }}>
          Color range (
          <Box as='span' sx={{ textTransform: 'none' }}>
            {currentVariable.unit}
          </Box>
          )
        </Column>
        <Column start={[1]} width={[6, 8, 4, 4]} sx={{ mb: 2 }}>
          <Colorbar
            colormap={colormap}
            clim={currentVariable.colorLimits}
            horizontal
            width={'100%'}
            sx={{ mt: 2 }}
          />
        </Column>
      </Row>
    </>
  )
}

export default DisplaySection
