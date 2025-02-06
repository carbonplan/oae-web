const { withPlausibleProxy } = require('next-plausible')

const isDev =
  process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development'

module.exports = withPlausibleProxy()({
  assetPrefix: isDev ? '' : 'https://oae-efficiency.carbonplan.org',
})
