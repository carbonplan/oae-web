import { create } from 'zustand'

export const variables = {
  EFFICIENCY: {
    label: 'Efficiency',
    threshold: 0.001,
    overview: true,
    url: 'https://oae-dataset-carbonplan.s3.us-east-2.amazonaws.com/store1b.zarr',
    variables: [
      {
        key: 'OAE_efficiency',
        colorLimits: [0, 1],
        colormap: 'cool',
        label: 'Efficiency',
        unit: 'mole CO₂ / mole alkalinity',
      },
    ],
  },
  FG_CO2: {
    label: 'Spread of CO₂ Uptake',
    threshold: 0.001,
    overview: true,
    hasOptions: true,
    url: 'https://carbonplan-share.s3.us-west-2.amazonaws.com/oae-efficiency/cumulative_FG_CO2_percent.zarr',
    variables: [
      {
        key: 'FG_CO2_percent_cumulative',
        colorLimits: [0, 100],
        colormap: 'warm',
        optionIndex: 0,
        label: '500km',
        graphLabel: 'CO₂ uptake',
        unit: '%',
      },
      {
        key: 'FG_CO2_percent_cumulative',
        colorLimits: [0, 100],
        colormap: 'warm',
        optionIndex: 1,
        label: '1000km',
        graphLabel: 'CO₂ uptake',
        unit: '%',
      },
      {
        key: 'FG_CO2_percent_cumulative',
        colorLimits: [0, 100],
        colormap: 'warm',
        optionIndex: 2,
        label: '2000km',
        graphLabel: 'CO₂ uptake',
        unit: '%',
      },
    ],
  },
  ALK: {
    label: 'Alkalinity',
    threshold: 0.0001,
    overview: false,
    hasOptions: true,
    variables: [
      {
        variable: 'ALK',
        delta: true,
        logScale: true,
        colorLimits: [0, 0.1],
        logColorLimits: [0.0001, 10],
        colormap: 'warm',
        label: 'change',
        unit: 'mEq/m³',
      },
      {
        variable: 'ALK',
        delta: false,
        colorLimits: [2000, 2800],
        colormap: 'warm',
        label: 'Total',
        unit: 'mEq/m³',
      },
    ],
  },
  DIC: {
    label: 'Dissolved inorganic carbon (DIC)',
    threshold: 0.001,
    overview: false,
    hasOptions: true,
    variables: [
      {
        variable: 'DIC',
        delta: true,
        colorLimits: [0, 0.1],
        colormap: 'warm',
        label: 'change',
        unit: 'mmol/m³',
      },
      {
        variable: 'DIC',
        delta: false,
        colorLimits: [1800, 2300],
        colormap: 'warm',
        label: 'Total',
        unit: 'mmol/m³',
      },
    ],
  },
}

const monthMap = {
  JAN: 1,
  APR: 4,
  JUL: 7,
  OCT: 10,
}

export const getInjectionMonth = (season) => {
  for (const month in season) {
    if (season[month]) {
      return monthMap[month]
    }
  }
  console.error('No injection month found, defaulting Jan')
  return 1
}

const useStore = create((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),

  regionDataLoading: false,
  setRegionDataLoading: (regionDataLoading) => set({ regionDataLoading }),

  expanded: true,
  setExpanded: (expanded) => set({ expanded }),

  variableFamily: 'EFFICIENCY',
  setVariableFamily: (variableFamily) => set({ variableFamily }),

  currentVariable: variables.EFFICIENCY.variables[0],
  setCurrentVariable: (currentVariable) => set({ currentVariable }),

  logScale: false,
  setLogScale: (logScale) =>
    set((state) => {
      if (!state.currentVariable.logScale) {
        return { logScale: false }
      }
      return { logScale }
    }),

  selectedRegion: null,
  setSelectedRegion: (selectedRegion) =>
    selectedRegion !== null
      ? set((state) => {
          if (selectedRegion !== 301) {
            alert(
              'only region 301 (upper mid pacific) is available at this time'
            )
            return { selectedRegion: null }
          }

          const activeLineData = state.efficiencyLineData[selectedRegion]
          return {
            selectedRegion,
            currentVariable: variables.ALK.variables[0],
            variableFamily: 'ALK',
            activeLineData,
          }
        })
      : set({
          selectedRegion,
          currentVariable: variables.EFFICIENCY.variables[0],
          variableFamily: 'EFFICIENCY',
          showRegionPicker: false,
          regionData: null,
          hoveredRegion: null,
          activeLineData: null,
          logScale: false,
        }),

  selectedRegionCenter: null,
  setSelectedRegionCenter: (selectedRegionCenter) =>
    set({ selectedRegionCenter }),

  efficiencyLineData: {},
  setEfficiencyLineData: (efficiencyLineData) => set({ efficiencyLineData }),

  hoveredRegion: null,
  setHoveredRegion: (hoveredRegion) =>
    set((state) => {
      if (state.selectedRegion) {
        return {}
      }

      const activeLineData = state.efficiencyLineData[hoveredRegion]
      return { hoveredRegion, activeLineData: activeLineData || null }
    }),

  activeLineData: null,
  setActiveLineData: (activeLineData) => set({ activeLineData }),

  overviewElapsedTime: 179,
  setOverviewElapsedTime: (overviewElapsedTime) => set({ overviewElapsedTime }),

  detailElapsedTime: 0,
  setDetailElapsedTime: (detailElapsedTime) => set({ detailElapsedTime }),

  filterToRegionsInView: false,
  setFilterToRegionsInView: (filterToRegionsInView) =>
    set({ filterToRegionsInView }),

  regionsInView: undefined,
  setRegionsInView: (regionsInView) =>
    set({ regionsInView: new Set(regionsInView) }),

  injectionSeason: {
    JAN: true,
    APR: false,
    JUL: false,
    OCT: false,
  },
  setInjectionSeason: (injectionSeason) =>
    set({
      injectionSeason,
    }),

  showRegionPicker: false,
  setShowRegionPicker: (showRegionPicker) => set({ showRegionPicker }),

  regionData: null,
  setRegionData: (regionData) => set({ regionData }),
}))

export default useStore
