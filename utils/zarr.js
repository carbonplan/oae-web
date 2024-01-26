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

export const getTimeSeriesData = (chunk, ids) => {
  const timeData = []
  ids.forEach((id) => {
    const line = chunk.pick(id, null, null)
    const sliceStart = line.offset
    const sliceEnd = line.offset + line.stride[0] * line.shape[0]
    if (
      sliceEnd > sliceStart &&
      sliceStart >= 0 &&
      sliceEnd <= chunk.data.length
    ) {
      const timeSeriesLength = sliceEnd - sliceStart
      const transformed = new Array(timeSeriesLength)
      for (let i = 0; i < timeSeriesLength; i++) {
        transformed[i] = [i, chunk.data[sliceStart + i]]
      }
      timeData.push(transformed)
    } else {
      console.warn('Invalid slice bounds:', sliceStart, sliceEnd)
    }
  })
  return timeData
}
