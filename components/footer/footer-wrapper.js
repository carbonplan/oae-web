import React from 'react'
import { SidebarFooter } from '@carbonplan/layouts'
import { useBreakpointIndex } from '@theme-ui/match-media'

const FooterWrapper = ({ children, bottom = 0 }) => {
  const index = useBreakpointIndex({ defaultIndex: 2 })

  const getMobileMarginFix = () => {
    // !important breaks things when using standard array syntax
    if (index <= 1) {
      return '0 !important'
    } else {
      return 0
    }
  }
  return (
    <SidebarFooter
      sx={{
        position: ['absolute', 'absolute', 'relative', 'relative'],
        bottom: bottom,
        width: ['100%', '100%', 'auto', 'auto'],
        mr: getMobileMarginFix(),
        ml: getMobileMarginFix(),
      }}
    >
      {children}
    </SidebarFooter>
  )
}

export default FooterWrapper
