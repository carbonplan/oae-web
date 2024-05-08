import { Column, Filter, Row } from '@carbonplan/components'

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
    <Row columns={[6, 4, 4, 4]}>
      <Column start={1} width={[3, 1, 2, 1]} sx={{ ...sx.label, pt: '2px' }}>
        Injection month
      </Column>
      <Column start={[4, 2, 3, 2]} width={[3, 4, 2, 2]}>
        <Filter
          values={injectionSeason}
          setValues={(val) => setInjectionSeason(val)}
        />
      </Column>
    </Row>
  )
}

export default InjectionMonth
