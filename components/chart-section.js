import useStore from '../store'
import OverviewChart from './overview-chart'
import RegionChart from './region-chart'

const ChartSection = ({ sx }) => {
  const currentVariable = useStore((s) => s.currentVariable)
  return currentVariable.key === 'EFFICIENCY' ? (
    <OverviewChart sx={sx} />
  ) : (
    <RegionChart sx={sx} />
  )
}

export default ChartSection
