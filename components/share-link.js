import React, { useState } from 'react'
import useStore from '../store'
import { SidebarAttachment } from '@carbonplan/layouts'
import { Button } from '@carbonplan/components'
import { Down } from '@carbonplan/icons'

const ShareLink = () => {
  const selectedRegion = useStore((state) => state.selectedRegion)
  const [buttonText, setButtonText] = useState('Copy region link')

  const copyToClipboard = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('region', selectedRegion)

    navigator.clipboard.writeText(url.toString()).then(() => {
      setButtonText('Copied!')
      setTimeout(() => setButtonText('Copy region link'), 2000)
    })
  }

  return (
    <>
      {selectedRegion !== null && (
        <SidebarAttachment
          expanded={true}
          side='left'
          width={4}
          sx={{
            bottom: '16px',
          }}
        >
          <Button
            size='xs'
            suffix={buttonText !== 'Copied!' && <Down />}
            sx={{ fontSize: [1] }}
            onClick={copyToClipboard}
          >
            {buttonText}
          </Button>
        </SidebarAttachment>
      )}
    </>
  )
}

export default ShareLink
