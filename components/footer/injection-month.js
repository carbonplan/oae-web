import { Filter } from '@carbonplan/components'
import { Box, Flex } from 'theme-ui'

import useStore from '../../store'

const sx = {
  label: {
    fontFamily: 'mono',
    letterSpacing: 'mono',
    textTransform: 'uppercase',
    color: 'secondary',
    fontSize: [1],
  },
}

const InjectionMonth = () => {
  const injectionSeason = useStore((state) => state.injectionSeason)
  const setInjectionSeason = useStore((state) => state.setInjectionSeason)

  return (
    <Flex sx={{ gap: [3, 4, 4, 5], mt: -2, mb: -2 }}>
      <Box sx={{ ...sx.label, pt: '2px' }}>Injection month</Box>

      <Filter
        values={injectionSeason}
        setValues={(val) => setInjectionSeason(val)}
        sx={{ '[role="checkbox"]': { fontSize: 1 } }}
      />
    </Flex>
  )
}

export default InjectionMonth
