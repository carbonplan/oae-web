import React from 'react'
import useStore from '../store'
import { Row, Column, Filter, Input } from '@carbonplan/components'
import { Box } from 'theme-ui'
import TooltipWrapper from './tooltip'

const Filters = ({ sx }) => {
  const injectionSeason = useStore((state) => state.injectionSeason)
  const setInjectionSeason = useStore((state) => state.setInjectionSeason)

  return (
    <>
      <Box sx={{ ...sx.heading, mb: 4 }}>injection</Box>
      <Row columns={[6, 4, 4, 4]} sx={{ mb: 4 }}>
        <Column start={1} width={[2, 1, 2, 2]} sx={{ ...sx.label, mt: 1 }}>
          Season
        </Column>
        <Column start={[3, 2, 3, 3]} width={[4, 4, 2, 2]}>
          <TooltipWrapper tooltip='The season during which the injections are made'>
            <Filter
              values={injectionSeason}
              setValues={(val) => setInjectionSeason(val)}
            />
          </TooltipWrapper>
        </Column>
      </Row>
    </>
  )
}

export default Filters
