import React, { useCallback, useMemo } from 'react'
import { Box, Checkbox, Label } from 'theme-ui'
import { Column, Filter, Select, Row, Colorbar } from '@carbonplan/components'
import { useThemedColormap } from '@carbonplan/colormaps'

import TooltipWrapper from '../tooltip'
import useStore, { variables } from '../../store'
import MonthPicker from '../month-picker'

const DisplaySection = ({ sx }) => {
  const currentVariable = useStore((s) => s.currentVariable)
  const setCurrentVariable = useStore((s) => s.setCurrentVariable)
  const variableFamily = useStore((s) => s.variableFamily)
  const setVariableFamily = useStore((s) => s.setVariableFamily)
  const showDeltaOverBackground = useStore((s) => s.showDeltaOverBackground)
  const setShowDeltaOverBackground = useStore(
    (s) => s.setShowDeltaOverBackground
  )
  const colormap = useThemedColormap(currentVariable.colormap)

  const disableBGControl = currentVariable.delta

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
  console.log(currentVariable)

  return (
    <>
      {/* <Box sx={sx.subHeading}>Display</Box> */}
      <Row columns={[6, 8, 4, 4]} sx={{ mt: 3 }}>
        <Column start={1} width={[2, 2, 1, 1]} sx={sx.label}>
          Variable
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]}>
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
            {Object.keys(variables).map((variable) => (
              <option key={variable} value={variable}>
                {variables[variable].meta.label}
              </option>
            ))}
          </Select>
          <Box sx={{ fontSize: 0, color: 'secondary' }}>
            {variables[variableFamily]?.meta?.description}
          </Box>

          <Box sx={{ mt: 3, mb: 2 }}>
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
            <Label
              sx={{
                opacity: disableBGControl ? 0.2 : 1,
                color: 'secondary',
                cursor: 'pointer',
                fontSize: 1,
                fontFamily: 'mono',
                pt: 2,
              }}
            >
              <Checkbox
                disabled={disableBGControl}
                checked={showDeltaOverBackground}
                onChange={(e) => setShowDeltaOverBackground(e.target.checked)}
                sx={{
                  opacity: disableBGControl ? 0.2 : 1,
                  width: 18,
                  mr: 1,
                  mt: '-3px',
                  cursor: 'pointer',
                  color: 'muted',
                  transition: 'color 0.15s',
                  'input:active ~ &': { bg: 'background', color: 'primary' },
                  'input:focus ~ &': {
                    bg: 'background',
                    color: showDeltaOverBackground ? 'primary' : 'muted',
                  },
                  'input:hover ~ &': { bg: 'background', color: 'primary' },
                  'input:focus-visible ~ &': {
                    outline: 'dashed 1px rgb(110, 110, 110, 0.625)',
                    background: 'rgb(110, 110, 110, 0.625)',
                  },
                }}
              />
              show change footprint
            </Label>
          </Box>
        </Column>
        <Column start={1} width={[2, 2, 1, 1]} sx={sx.label}>
          Month
        </Column>
        <Column start={[3, 3, 2, 2]} width={[4, 6, 3, 3]} sx={{ mb: 4 }}>
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
