import React, { useCallback, useMemo } from 'react'
import { Box } from 'theme-ui'
import { Column, Filter, Select, Row, Colorbar } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'

import TooltipWrapper from './tooltip'
import useStore, { variables } from '../store'
import MonthPicker from './month-picker'

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
          <Box>
            <Select
              disabled={!selectedRegion}
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
              {Object.keys(variables).map((variable) => (
                <option key={variable} value={variable}>
                  {variables[variable].meta.label}
                </option>
              ))}
            </Select>
            <Box sx={{ fontSize: 0, color: 'secondary' }}>
              {variables[variableFamily]?.meta?.description}
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
        <Column start={1} width={[2, 2, 1, 1]} sx={{ ...sx.label, my: 4 }}>
          Month
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]} sx={{ my: 4 }}>
          <MonthPicker />
        </Column>
        <Column start={1} width={[6, 8, 4, 4]} sx={sx.label}>
          Color range (
          <Box as='span' sx={{ textTransform: 'none' }}>
            {currentVariable.unit}
          </Box>
          )
        </Column>
        <Column start={[1]} width={[6, 8, 4, 4]}>
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
