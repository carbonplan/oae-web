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
    colorLimits: [0, 4000],
    colormap: 'warm',
    label: 'Alkalinity',
    unit: 'unit',
    description: 'tk',
  },
  {
    key: 'ALK_ALT_CO2',
    colorLimits: [0, 4000],
    colormap: 'cool',
    label: 'Alkalinity',
    unit: 'unit',
    description: 'tk',
  },
  {
    key: 'DIC',
    colorLimits: [0, 4000],
    colormap: 'teals',
    label: 'DIC',
    unit: 'unit',
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
      : set({ selectedRegion, currentVariable: overviewVariable }),

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
