import React from 'react'
import { Row, Column, Filter, Input } from '@carbonplan/components'
import { Box } from 'theme-ui'

const Filters = ({
  sx,
  timeHorizon,
  setTimeHorizon,
  injectionSeason,
  setInjectionSeason,
}) => {
  return (
    <>
      <Box sx={sx.heading}>injection</Box>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[1]} sx={sx.label}>
          Season
        </Column>
        <Column start={[2]} width={[2]} sx={sx.label}>
          <Filter
            values={injectionSeason}
            setValues={(val) => setInjectionSeason(val)}
          />
        </Column>
      </Row>
      <Row columns={[6, 8, 3, 3]}>
        <Column start={1} width={[1]} sx={sx.label}>
          Time horizon
        </Column>
        <Column start={[2]} width={[2]} sx={sx.label}>
          <Input
            sx={{ ...sx.label, width: '50px', my: 0, pt: 0 }}
            value={timeHorizon}
            type='number'
            min={0}
            max={15}
            onChange={(e) =>
              setTimeHorizon(e.target.value > 15 ? 15 : e.target.value)
            }
          />
          years
        </Column>
      </Row>
    </>
  )
}

export default Filters
