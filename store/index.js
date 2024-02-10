import { create } from 'zustand'

const useStore = create((set) => ({
  expanded: true,
  setExpanded: (expanded) => set({ expanded }),

  selectedRegion: null,
  setSelectedRegion: (selectedRegion) => set({ selectedRegion }),

  hoveredRegion: null,
  setHoveredRegion: (hoveredRegion) => set({ hoveredRegion }),

  timeHorizon: 15,
  setTimeHorizon: (timeHorizon) => set({ timeHorizon }),

  elapsedTime: 0,
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),

  regionsInView: [],
  setRegionsInView: (regionsInView) =>
    set({ regionsInView: Array.from(new Set(regionsInView)) }),

  injectionSeason: {
    JAN: true,
    APR: false,
    JUL: false,
    OCT: false,
  },
  setInjectionSeason: (injectionSeason) => set({ injectionSeason }),
}))

export default useStore
