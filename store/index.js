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
    url: 'https://carbonplan-share.s3.us-west-2.amazonaws.com/oae-efficiency/cumulative_FG_CO2_percent.zarr',
    optionsTooltip: 'Distance from center of injection region',
    variables: [
      {
        key: 'FG_CO2_percent_cumulative',
        colorLimits: [0, 100],
        colormap: 'cool',
        optionIndex: 0,
        label: '500 km',
        graphLabel: 'CO₂ uptake',
        unit: '%',
      },
      {
        key: 'FG_CO2_percent_cumulative',
        colorLimits: [0, 100],
        colormap: 'cool',
        optionIndex: 1,
        label: '1000 km',
        graphLabel: 'CO₂ uptake',
        unit: '%',
      },
      {
        key: 'FG_CO2_percent_cumulative',
        colorLimits: [0, 100],
        colormap: 'cool',
        optionIndex: 2,
        label: '2000 km',
        graphLabel: 'CO₂ uptake',
        unit: '%',
      },
    ],
  },
  ALK: {
    label: 'Alkalinity',
    threshold: 0.0001,
    optionsTooltip:
      'View the change in alkalinity, or the total alkalinity value.',
    variables: [
      {
        variable: 'ALK',
        delta: true,
        logScale: true,
        colorLimits: [0, 0.1],
        logColorLimits: [0.0001, 10],
        colormap: 'warm',
        label: 'Change',
        unit: 'mEq/m²',
      },
      {
        variable: 'ALK',
        delta: false,
        colorLimits: [2000, 2800],
        colormap: 'warm',
        label: 'Total',
        unit: 'mEq/m²',
      },
    ],
  },
  DIC: {
    label: 'Dissolved inorganic carbon (DIC)',
    threshold: 0.00001,
    optionsTooltip: 'View the change in DIC, or the total DIC value.',
    variables: [
      {
        variable: 'DIC',
        delta: true,
        logScale: true,
        colorLimits: [0, 0.1],
        logColorLimits: [0.0001, 10],
        colormap: 'warm',
        label: 'Change',
        unit: 'mmol/m²',
      },
      {
        variable: 'DIC',
        delta: false,
        colorLimits: [400000, 1400000],
        colormap: 'warm',
        label: 'Total',
        unit: 'mmol/m²',
      },
    ],
  },
  FG: {
    label: 'Flux',
    optionsTooltip: 'View the change in CO₂ flux, or the total flux value.',
    variables: [
      {
        variable: 'FG',
        delta: true,
        logScale: true,
        colorLimits: [0, -1e-2],
        logColorLimits: [-1e-5, -1],
        threshold: -1e-6,
        colormap: 'warm',
        label: 'Change',
        unit: 'mol/m²/yr',
        unitConversion: -315.36,
      },
      {
        variable: 'FG',
        delta: false,
        colorLimits: [-5, 5],
        colormap: 'orangeblue',
        flipColormap: true,
        label: 'Total',
        unit: 'mol/m²/yr',
        unitConversion: -315.36,
      },
    ],
  },
  pCO2SURF: {
    label: 'pCO₂',
    optionsTooltip: 'View the change in pCO₂, or the total pCO₂ value.',
    variables: [
      {
        variable: 'pCO2SURF',
        delta: true,
        logScale: true,
        threshold: -1e-6,
        colorLimits: [0, -0.01],
        logColorLimits: [-1e-5, -1],
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
    label: 'pH',
    threshold: 1e-8,
    optionsTooltip: 'View the change in pH, or the total pH value.',
    variables: [
      {
        variable: 'PH',
        delta: true,
        logScale: true,
        colorLimits: [0, 1e-4],
        logColorLimits: [1e-8, 0.1],
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
  // Omega_arag: {
  //   label: 'Omega_arag',
  //   threshold: 0.001,
  //   variables: [
  //     {
  //       variable: 'Omega_arag',
  //       delta: true,
  //       colorLimits: [0, 1],
  //       colormap: 'warm',
  //       label: 'Change',
  //     },
  //     {
  //       variable: 'Omega_arag',
  //       delta: false,
  //       colorLimits: [0, 1],
  //       colormap: 'warm',
  //       label: 'Total',
  //     },
  //   ],
  // },
  // Omega_calc: {
  //   label: 'Omega_calc',
  //   threshold: 0.001,
  //   variables: [
  //     {
  //       variable: 'Omega_calc',
  //       delta: true,
  //       colorLimits: [0, 1],
  //       colormap: 'warm',
  //       label: 'Change',
  //     },
  //     {
  //       variable: 'Omega_calc',
  //       delta: false,
  //       colorLimits: [0, 1],
  //       colormap: 'warm',
  //       label: 'Total',
  //     },
  //   ],
  // },
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
          const activeLineData = state.overviewLineData[selectedRegion]
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
          selectedRegionCenter: null,
        }),

  selectedRegionCenter: null,
  setSelectedRegionCenter: (selectedRegionCenter) =>
    set({ selectedRegionCenter }),

  overviewLineData: {},
  setOverviewLineData: (overviewLineData) => set({ overviewLineData }),

  regionGeojson: null,
  setRegionGeojson: (regionGeojson) => set({ regionGeojson }),

  hoveredRegion: null,
  setHoveredRegion: (hoveredRegion) =>
    set((state) => {
      if (state.selectedRegion) {
        return {}
      }

      const activeLineData = state.overviewLineData[hoveredRegion]
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
