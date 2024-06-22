import React from 'react'
import { Button } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'

const DownloadCSV = ({ onClick, disabled, sx = {} }) => {
  return (
    <Button
      inverted
      disabled={disabled}
      onClick={onClick}
      sx={{
        fontSize: [0, 0, 0, 1],
        textTransform: 'uppercase',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        minWidth: '120px',
        textAlign: 'right',
        '&:disabled': {
          color: 'muted',
          pointerEvents: 'none',
        },
        ...sx,
      }}
    >
      <Down sx={{ height: 10, width: 10, mr: 1 }} />
      Download CSV
    </Button>
  )
}

export default DownloadCSV
