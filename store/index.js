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

  regionsInView: new Set(),
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
