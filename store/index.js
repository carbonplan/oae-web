import { create } from 'zustand'

export const variables = {
  EFFICIENCY: {
    label: 'Efficiency',
    threshold: 0.001,
    overview: true,
    url: 'https://carbonplan-oae-efficiency.s3.us-west-2.amazonaws.com/store1b.zarr',
    variables: [
      {
        variable: 'OAE_efficiency',
        colorLimits: [0, 1],
        colormap: 'cool',
        label: 'Efficiency ratio',
        unit: 'mole CO₂ / mole alkalinity',
        graphUnit: '',
      },
    ],
  },
  FG_CO2: {
    label: 'Spread of CO₂ uptake',
    threshold: 0.001,
    overview: true,
    url: 'https://carbonplan-oae-efficiency.s3.us-west-2.amazonaws.com/cumulative_FG_CO2_percent.zarr',
    optionsTooltip:
      'View the percentage of cumulative CO₂ uptake taking place within 500 km, 1000 km, or 2000 km of the injection center.',
    variables: [
      {
        variable: 'FG_CO2_percent_cumulative',
        colorLimits: [0, 100],
        colormap: 'cool',
        optionIndex: 0,
        label: '500 km',
        graphLabel: 'Uptake percentage',
        unit: '%',
        graphUnit: '',
      },
      {
        variable: 'FG_CO2_percent_cumulative',
        colorLimits: [0, 100],
        colormap: 'cool',
        optionIndex: 1,
        label: '1000 km',
        graphLabel: 'Uptake percentage',
        unit: '%',
        graphUnit: '',
      },
      {
        variable: 'FG_CO2_percent_cumulative',
        colorLimits: [0, 100],
        colormap: 'cool',
        optionIndex: 2,
        label: '2000 km',
        graphLabel: 'Uptake percentage',
        unit: '%',
        graphUnit: '',
      },
    ],
  },
  ALK: {
    label: 'Surface alkalinity',
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
  pCO2SURF: {
    label: 'Partial pressure of CO₂',
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
  FG: {
    label: 'Air-sea CO₂ flux',
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
  DIC: {
    label: 'Dissolved inorganic carbon',
    threshold: 0.00001,
    optionsTooltip:
      'View the change in DIC. Total values are not available for this variable.',
    variables: [
      {
        variable: 'DIC',
        delta: true,
        logScale: true,
        colorLimits: [0, 0.0025],
        logColorLimits: [0.00001, 0.1],
        colormap: 'warm',
        label: 'Change',
        unit: 'mol/m²',
        unitConversion: 0.001,
      },
      // {
      //   variable: 'DIC',
      //   delta: false,
      //   colorLimits: [400, 1400],
      //   colormap: 'warm',
      //   label: 'Total',
      //   unit: 'mol/m²',
      //   unitConversion: 0.001,
      // },
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

const findVariableFamily = (variable) => {
  return Object.keys(variables).find((family) =>
    variables[family].variables.some((v) => v.variable === variable.variable)
  )
}

const useStore = create((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),

  regionDataLoading: false,
  setRegionDataLoading: (regionDataLoading) => set({ regionDataLoading }),

  circlePickerMetaData: null,
  setCirclePickerMetaData: (circlePickerMetaData) =>
    set({ circlePickerMetaData }),

  expanded: true,
  setExpanded: (expanded) => set({ expanded }),

  variableFamily: 'EFFICIENCY',
  setVariableFamily: (variableFamily) => set({ variableFamily }),

  currentVariable: variables.EFFICIENCY.variables[0],
  setCurrentVariable: (currentVariable) =>
    set(() => {
      const variableFamily = findVariableFamily(currentVariable)
      if (variables[variableFamily]?.overview) {
        return {
          currentOverviewVariable: currentVariable,
          currentVariable,
          variableFamily,
        }
      } else {
        return { currentVariable, variableFamily }
      }
    }),

  currentOverviewVariable: variables.EFFICIENCY.variables[0],
  setCurrentOverviewVariable: (currentOverviewVariable) =>
    set({ currentOverviewVariable }),

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
          const activeLineData =
            state.overviewLineData?.[selectedRegion] || null
          const selectedRegionGeojson = state.regionGeojson.features.find(
            (f) => f.properties.polygon_id === selectedRegion
          )
          return {
            selectedRegion,
            currentVariable: variables.ALK.variables[0],
            variableFamily: 'ALK',
            activeLineData,
            selectedRegionGeojson,
          }
        })
      : set((state) => {
          const isOverview = variables[state.variableFamily].overview
          const variableFamily = isOverview
            ? state.variableFamily
            : findVariableFamily(state.currentOverviewVariable)
          return {
            selectedRegion,
            currentVariable: isOverview
              ? state.currentVariable
              : state.currentOverviewVariable,
            currentOverviewVariable: isOverview
              ? state.currentVariable
              : state.currentOverviewVariable,
            variableFamily: variableFamily,
            showRegionPicker: false,
            regionData: null,
            hoveredRegion: null,
            activeLineData: null,
            logScale: false,
            selectedRegionCenter: null,
          }
        }),

  selectedRegionCenter: null,
  setSelectedRegionCenter: (selectedRegionCenter) =>
    set({ selectedRegionCenter }),

  overviewLineData: {},
  setOverviewLineData: (overviewLineData) => set({ overviewLineData }),

  regionGeojson: null,
  setRegionGeojson: (regionGeojson) => set({ regionGeojson }),

  selectedRegionGeojson: null,
  setSelectedRegionGeojson: (selectedRegionGeojson) =>
    set({ selectedRegionGeojson }),

  hoveredRegion: null,
  setHoveredRegion: (hoveredRegion) =>
    set((state) => {
      if (state.selectedRegion) {
        return {}
      }
      const activeLineData = state.overviewLineData?.[hoveredRegion] || null
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

  regionsInView: null,
  setRegionsInView: (regionsInView) => set({ regionsInView }),

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
