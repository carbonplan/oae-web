import { create } from 'zustand'

export const overviewVariable = {
  key: 'EFFICIENCY',
  colorLimits: [0, 1],
  colormap: 'cool',
  label: 'Efficiency',
  unit: 'mole CO₂ / mole alkalinity',
}

export const variables = {
  EFFICIENCY: {
    meta: {
      label: 'Efficiency',
      threshold: 0.001,
    },
    variables: [overviewVariable],
  },
  ALK: {
    meta: {
      label: 'Alkalinity',
      threshold: 0.001,
    },
    variables: [
      {
        variable: 'ALK',
        delta: true,
        colorLimits: [0, 0.1],
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
    meta: {
      label: 'Dissolved inorganic carbon (DIC)',

      threshold: 0.001,
    },
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

  currentVariable: overviewVariable,
  setCurrentVariable: (currentVariable) => set({ currentVariable }),

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
          currentVariable: overviewVariable,
          variableFamily: 'EFFICIENCY',
          showRegionPicker: false,
          regionData: null,
          hoveredRegion: null,
          activeLineData: null,
        }),

  selectedRegionCenter: null,
  setSelectedRegionCenter: (selectedRegionCenter) =>
    set({ selectedRegionCenter }),

  showDeltaOverBackground: false,
  setShowDeltaOverBackground: (showDeltaOverBackground) =>
    set({ showDeltaOverBackground }),

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
