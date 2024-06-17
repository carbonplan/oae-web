import React, { createContext, useContext, useRef } from 'react'

const ScrollContext = createContext(null)

export const ScrollProvider = ({ children }) => {
  const elementRef = useRef(null)

  const scrollToElement = () => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView()
    }
  }

  return (
    <ScrollContext.Provider value={{ scrollToElement, elementRef }}>
      {children}
    </ScrollContext.Provider>
  )
}

export const useScroll = () => useContext(ScrollContext)
