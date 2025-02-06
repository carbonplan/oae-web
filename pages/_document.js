import React from 'react'
import Document, { Html, Main, NextScript, Head } from 'next/document'
import { Tracking } from '@carbonplan/components'
import { InitializeColorMode } from 'theme-ui'

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en' className='no-focus-outline'>
        <Head>
          <Tracking id={process.env.GA_TRACKING_ID} />
          <script
            defer
            data-domain='carbonplan.org'
            data-api='https://carbonplan.org/proxy/api/event'
            src='https://carbonplan.org/js/script.file-downloads.outbound-links.js'
          ></script>
        </Head>
        <body>
          <InitializeColorMode />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
