import React from 'react'
import useStore from '../store'
import { Row, Column, Filter, Input } from '@carbonplan/components'
import { Box } from 'theme-ui'

const Filters = ({ sx }) => {
  const timeHorizon = useStore((state) => state.timeHorizon)
  const setTimeHorizon = useStore((state) => state.setTimeHorizon)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const setInjectionSeason = useStore((state) => state.setInjectionSeason)

  return (
    <>
      <Box sx={sx.heading}>injection</Box>
      <Row columns={[6, 4, 4, 4]}>
        <Column start={1} width={[1]} sx={sx.label}>
          Season
        </Column>
        <Column start={[3]} width={[2]} sx={sx.label}>
          <Filter
            values={injectionSeason}
            setValues={(val) => setInjectionSeason(val)}
          />
        </Column>
      </Row>
      <Row columns={[6, 4, 4, 4]}>
        <Column start={1} width={[2]} sx={sx.label}>
          Time horizon
        </Column>
        <Column start={[3]} width={[2]} sx={sx.label}>
          <Input
            sx={{
              ...sx.label,
              width: '40px',
              my: 0,
              pt: 0,
              color: 'primary',
              display: 'inline',
              '&::-webkit-inner-spin-button': {
                opacity: 1,
              },
            }}
            value={timeHorizon}
            type='number'
            min={5} // prevent graph from showing decimal years
            max={15}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              if (!isNaN(value)) {
                setTimeHorizon(value > 15 ? 15 : value)
              }
            }}
          />
          <Box as={'span'} sx={{ ml: 1 }}>
            years
          </Box>
        </Column>
      </Row>
    </>
  )
}

export default Filters
