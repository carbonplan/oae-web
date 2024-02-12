import { create } from 'zustand'

export const variables = {
  EFFICIENCY: {
    colorLimits: [0.65, 0.85],
    colormap: 'warm',
    label: 'Efficiency',
    unit: '',
    description: 'tk',
    detail: false,
  },
  ALK: {
    colorLimits: [0, 4000],
    colormap: 'warm',
    label: 'Alkalinity',
    unit: 'unit',
    description: 'tk',
    detail: true,
  },
  ALK_ALT_CO2: {
    colorLimits: [0, 4000],
    colormap: 'cool',
    label: 'Alkalinity',
    unit: 'unit',
    description: 'tk',
    detail: true,
  },
  DIC: {
    colorLimits: [0, 4000],
    colormap: 'teals',
    label: 'DIC',
    unit: 'unit',
    description: 'tk',
    detail: true,
  },
}

const useStore = create((set) => ({
  expanded: true,
  setExpanded: (expanded) => set({ expanded }),

  currentVariable: variables.EFFICIENCY,
  setCurrentVariable: (variableKey) =>
    set({ currentVariable: variables[variableKey] }),

  colormap: undefined,
  setColormap: (colormap) => set({ colormap }),

  selectedRegion: null,
  setSelectedRegion: (selectedRegion) => set({ selectedRegion }),

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
}))

export default useStore
