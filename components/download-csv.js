import React from 'react'
import { Button } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'

const DownloadCSV = ({ onClick, disabled, sx = {} }) => {
  return (
    <Button
      inverted
      disabled={disabled}
      onClick={onClick}
      size='xs'
      sx={{
        fontSize: [1, 1, 1, 2],
        textTransform: 'uppercase',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        minWidth: '120px',
        textAlign: 'right',
        whiteSpace: 'nowrap',
        '&:disabled': {
          color: 'muted',
          pointerEvents: 'none',
        },
        ...sx,
      }}
      prefix={<Down />}
    >
      Download CSV
    </Button>
  )
}

export default DownloadCSV
