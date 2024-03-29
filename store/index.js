import { create } from 'zustand'

export const overviewVariable = {
  key: 'EFFICIENCY',
  colorLimits: [0.65, 0.85],
  colormap: 'warm',
  label: 'Efficiency',
  unit: '',
  description: 'tk',
}

export const variables = {
  ALK: {
    meta: {
      label: 'Alkalinity',
      description: 'tk',
    },
    variables: [
      {
        key: 'DELTA_ALK',
        calc: ['ALK', 'ALK_ALT_CO2'],
        colorLimits: [0, 0.1],
        threshold: 0.001,
        colormap: 'warm',
        label: 'change',
        unit: 'mEq/m³',
        description: 'tk',
      },
      {
        key: 'ALK',
        colorLimits: [2000, 2800],
        colormap: 'warm',
        label: 'Total',
        unit: 'mEq/m³',
        description: 'tk',
      },
    ],
  },
  DIC: {
    meta: {
      label: 'Dissolved inorganic carbon (DIC)',
      description: 'tk',
    },
    variables: [
      {
        key: 'DELTA_DIC',
        calc: ['DIC', 'DIC_ALT_CO2'],
        colorLimits: [0, 0.1],
        threshold: 0.001,
        colormap: 'cool',
        label: 'change',
        unit: 'mmol/m³',
        description: 'tk',
      },
      {
        key: 'DIC',
        colorLimits: [1800, 2300],
        colormap: 'cool',
        label: 'Total',
        unit: 'mmol/m³',
        description: 'tk',
      },
    ],
  },
}

const useStore = create((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),

  regionDataLoading: false,
  setRegionDataLoading: (regionDataLoading) => set({ regionDataLoading }),

  expanded: true,
  setExpanded: (expanded) => set({ expanded }),

  variableFamily: 'ALK',
  setVariableFamily: (variableFamily) => set({ variableFamily }),

  currentVariable: overviewVariable,
  setCurrentVariable: (currentVariable) => set({ currentVariable }),

  selectedRegion: null,
  setSelectedRegion: (selectedRegion) =>
    selectedRegion !== null
      ? set(() => {
          if (selectedRegion !== 0) {
            alert('only region 0 (near greenland!) is available at this time')
            return { selectedRegion: null }
          }
          return { selectedRegion, currentVariable: variables.ALK.variables[0] }
        })
      : set({
          selectedRegion,
          currentVariable: overviewVariable,
          showRegionPicker: false,
          regionData: null,
          hoveredRegion: null,
          elapsedTime: 0,
        }),

  showDeltaOverBackground: false,
  setShowDeltaOverBackground: (showDeltaOverBackground) =>
    set({ showDeltaOverBackground }),

  hoveredRegion: null,
  setHoveredRegion: (hoveredRegion) => set({ hoveredRegion }),

  timeHorizon: 15,
  setTimeHorizon: (timeHorizon) => set({ timeHorizon }),

  elapsedTime: 0,
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),

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
    set(() => {
      if (injectionSeason.JAN) {
        return { injectionSeason }
      }
      alert('only january is available at this time')
      return {
        injectionSeason: { JAN: true, APR: false, JUL: false, OCT: false },
      }
    }),

  showRegionPicker: false,
  setShowRegionPicker: (showRegionPicker) => set({ showRegionPicker }),

  regionData: null,
  setRegionData: (regionData) => set({ regionData }),
}))

export default useStore
