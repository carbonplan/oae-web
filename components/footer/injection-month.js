import { Column, Filter, Row } from '@carbonplan/components'
import { Flex } from 'theme-ui'

import useStore from '../../store'
import TooltipWrapper from '../tooltip'

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
    <Row columns={[6, 4, 4, 4]}>
      <Column start={1} width={[2, 1, 2, 2]} sx={{ ...sx.label, pt: '2px' }}>
        Injection month
      </Column>
      <Column start={[3, 2, 3, 3]} width={[4, 4, 2, 2]}>
        <Filter
          values={injectionSeason}
          setValues={(val) => setInjectionSeason(val)}
        />
      </Column>
    </Row>
  )
}

export default InjectionMonth
