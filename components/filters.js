import React from 'react'
import useStore from '../store'
import { Row, Column, Filter, Input } from '@carbonplan/components'
import { Box, Flex } from 'theme-ui'
import TooltipWrapper from './tooltip'

const Filters = ({ sx }) => {
  const timeHorizon = useStore((state) => state.timeHorizon)
  const setTimeHorizon = useStore((state) => state.setTimeHorizon)
  const injectionSeason = useStore((state) => state.injectionSeason)
  const setInjectionSeason = useStore((state) => state.setInjectionSeason)

  return (
    <>
      <Box sx={{ ...sx.heading, mb: 4 }}>injection</Box>
      <TooltipWrapper tooltip='The season injections are made' mt={-1}>
        <Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
          <Box sx={sx.label}>Season</Box>
          <Box sx={sx.label}>
            <Filter
              values={injectionSeason}
              setValues={(val) => setInjectionSeason(val)}
            />
          </Box>
        </Flex>
      </TooltipWrapper>
      <TooltipWrapper
        tooltip='The time horizon over which the carbon removal is calculated'
        mt={3}
      >
        <Flex
          sx={{
            justifyContent: 'space-between',
            width: '100%',
            alignContent: 'center',
            mt: 3,
          }}
        >
          <Box sx={sx.label}>Time horizon</Box>
          <Box sx={sx.label}>
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
            <Box as={'span'} sx={{ mx: 2 }}>
              years
            </Box>
          </Box>
        </Flex>
      </TooltipWrapper>
    </>
  )
}

export default Filters
