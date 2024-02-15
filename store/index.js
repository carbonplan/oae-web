import { create } from 'zustand'

export const overviewVariable = {
  key: 'EFFICIENCY',
  colorLimits: [0.65, 0.85],
  colormap: 'warm',
  label: 'Efficiency',
  unit: '',
  description: 'tk',
}

export const variables = [
  {
    key: 'ALK',
    colorLimits: [2000, 2800],
    colormap: 'warm',
    label: 'Alkalinity',
    unit: 'mEq/m³',
    description: 'tk',
  },
  {
    key: 'ALK_ALT_CO2',
    colorLimits: [2000, 2800],
    colormap: 'warm',
    label: 'Alkalinity counterfactual',
    unit: 'mEq/m³',
    description: 'tk',
  },
  {
    key: 'DIC',
    colorLimits: [1800, 2300],
    colormap: 'cool',
    label: 'DIC',
    unit: 'mmol/m³',
    description: 'tk',
  },
  {
    key: 'DIC_ALT_CO2',
    colorLimits: [1800, 2300],
    colormap: 'cool',
    label: 'DIC counterfactual',
    unit: 'mmol/m³',
    description: 'tk',
  },
]

const useStore = create((set) => ({
  expanded: true,
  setExpanded: (expanded) => set({ expanded }),

  currentVariable: overviewVariable,
  setCurrentVariable: (currentVariable) => set({ currentVariable }),

  selectedRegion: null,
  setSelectedRegion: (selectedRegion) =>
    selectedRegion !== null
      ? set({ selectedRegion, currentVariable: variables[0] })
      : set({
          selectedRegion,
          currentVariable: overviewVariable,
          showRegionPicker: false,
          regionData: null,
          hoveredRegion: null,
        }),

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
  setInjectionSeason: (injectionSeason) => set({ injectionSeason }),

  showRegionPicker: false,
  setShowRegionPicker: (showRegionPicker) => set({ showRegionPicker }),

  regionData: null,
  setRegionData: (regionData) => set({ regionData }),
}))

export default useStore
