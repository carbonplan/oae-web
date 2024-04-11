export const downloadCsv = (data, fileName = 'data.csv') => {
  if (!data || !data.length) {
    return
  }
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((fieldName) => JSON.stringify(row[fieldName])).join(',')
    ),
  ]
  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
