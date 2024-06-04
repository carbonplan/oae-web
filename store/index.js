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
      threshold: 0.0001,
    },
    variables: [
      {
        variable: 'ALK',
        delta: true,
        logScale: true,
        colorLimits: [0, 0.1],
        logColorLimits: [0.0001, 10],
        colormap: 'warm',
        label: 'Change',
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
      threshold: 0.00001,
    },
    variables: [
      {
        variable: 'DIC',
        delta: true,
        logScale: true,
        colorLimits: [0, 0.01],
        logColorLimits: [0.0001, 10],
        colormap: 'warm',
        label: 'Change',
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
  FG: {
    meta: {
      label: 'Flux',
      threshold: -Infinity,
    },
    variables: [
      {
        variable: 'FG',
        delta: true,
        colorLimits: [0, 1e-4],
        colormap: 'warm',
        label: 'Change',
        unit: 'mol/m²/yr',
        unitConversion: 3.15576,
      },
      {
        variable: 'FG',
        delta: false,
        colorLimits: [-0.01, 0.01],
        colormap: 'orangeblue',
        label: 'Total',
        unit: 'mol/m²/yr',
        unitConversion: 3.15576,
      },
    ],
  },
  pCO2SURF: {
    meta: {
      label: 'pCO₂',
      threshold: -Infinity,
    },
    variables: [
      {
        variable: 'pCO2SURF',
        delta: true,
        colorLimits: [0, -0.01],
        colormap: 'warm',
        label: 'Change',
        unit: 'µatm',
      },
      {
        variable: 'pCO2SURF',
        delta: false,
        colorLimits: [300, 400],
        colormap: 'warm',
        label: 'Total',
        unit: 'µatm',
      },
    ],
  },
  PH: {
    meta: {
      label: 'pH',
      threshold: 1e-8,
    },
    variables: [
      {
        variable: 'PH',
        delta: true,
        logScale: true,
        colorLimits: [0, 1e-4],
        logColorLimits: [1e-8, 1],
        colormap: 'warm',
        label: 'Change',
      },
      {
        variable: 'PH',
        delta: false,
        colorLimits: [7.8, 8.4],
        colormap: 'warm',
        label: 'Total',
      },
    ],
  },
  Omega_arag: {
    meta: {
      label: 'Omega_arag',
      threshold: 0.001,
    },
    variables: [
      {
        variable: 'Omega_arag',
        delta: true,
        colorLimits: [0, 1],
        colormap: 'warm',
        label: 'Change',
      },
      {
        variable: 'Omega_arag',
        delta: false,
        colorLimits: [0, 1],
        colormap: 'warm',
        label: 'Total',
      },
    ],
  },
  Omega_calc: {
    meta: {
      label: 'Omega_calc',
      threshold: 0.001,
    },
    variables: [
      {
        variable: 'Omega_calc',
        delta: true,
        colorLimits: [0, 1],
        colormap: 'warm',
        label: 'Change',
      },
      {
        variable: 'Omega_calc',
        delta: false,
        colorLimits: [0, 1],
        colormap: 'warm',
        label: 'Total',
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
          currentVariable: overviewVariable,
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
