import zarr from 'zarr-js'

export const fetchZarrMetadata = async (metadataUrl) => {
  try {
    const metadata = await fetch(metadataUrl)
    const metadataJson = await metadata.json()
    return metadataJson.metadata
  } catch (error) {
    console.error('Error fetching group:', error)
  }
}

export const loadZarr = async (url, variable) => {
  return new Promise((resolve, reject) => {
    zarr().load(url + '/' + variable, (err, data) => {
      if (err) {
        console.error('Error loading data:', err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const openZarr = async (url, variable) => {
  return new Promise((resolve, reject) => {
    zarr().open(url + '/' + variable, (err, get) => {
      if (err) {
        console.error('Error opening data:', err)
        reject(err)
      } else {
        resolve(get)
      }
    })
  })
}

export const getChunk = async (get, chunk) => {
  return new Promise((resolve, reject) => {
    get(chunk, (err, data) => {
      if (err) {
        console.error('Error getting chunk:', err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const getTimeSeriesData = (chunk, ids, startYear) => {
  const timeData = []
  ids.forEach((id, idIndex) => {
    const line = chunk.pick(null, idIndex, 0)
    const idLine = []
    for (let i = 0; i < line.shape[0]; i++) {
      const toYear = startYear + (i + 1) / 12
      idLine.push([toYear, parseFloat(line.get(i).toFixed(3))])
    }
    timeData.push(idLine)
  })
  return timeData
}
