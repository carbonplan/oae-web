import React, { useState } from 'react'
import { Row, Column, Filter } from '@carbonplan/components'
import { Box } from 'theme-ui'

const Filters = ({ sx }) => {
  const [seasons, setSeasons] = useState({
    JAN: true,
    APR: false,
    JUL: false,
    OCT: false,
  })

  return (
    <>
      <Box sx={sx.heading}>injection</Box>
      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2]} sx={sx.label}>
          Season
        </Column>
        <Column start={[3]} width={[2]} sx={sx.label}>
          <Filter values={seasons} setValues={(val) => setSeasons(val)} />
        </Column>
      </Row>
      <Row columns={[6, 8, 4, 4]}>
        <Column start={1} width={[2]} sx={sx.label}>
          Time horizon
        </Column>
      </Row>
    </>
  )
}

export default Filters
