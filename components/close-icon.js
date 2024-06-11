import React from 'react'
import { X } from '@carbonplan/icons'
import { Button } from '@carbonplan/components'

const CloseIcon = ({ onClick, theme, sx = {} }) => {
  return (
    <Button
      sx={{
        cursor: 'pointer',
        borderRadius: '50%',
        textAlign: 'center',
        width: 16,
        height: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.rawColors.muted,
        color: theme.rawColors.secondary,
        '&:hover': {
          color: theme.rawColors.primary,
        },
        ml: 2,
        mb: 2,
        ...sx,
      }}
      onClick={onClick}
    >
      <X height={10} width={10} sx={{ mb: '2px' }} />
    </Button>
  )
}

export default CloseIcon
