import React from 'react'
import { useEffect, useState } from 'react'

const HydrationZustand = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return <>{isHydrated ? <>{children}</> : null}</>
}

export default HydrationZustand
