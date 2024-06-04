import useStore, { variables } from '../store'
import OverviewChart from './overview-chart'
import RegionChart from './region-chart'

const ChartSection = ({ sx }) => {
  const isOverview = useStore((s) => variables[s.variableFamily].overview)
  return isOverview ? <OverviewChart sx={sx} /> : <RegionChart sx={sx} />
}

export default ChartSection
