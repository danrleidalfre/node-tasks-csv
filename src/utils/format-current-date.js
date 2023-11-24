export function formatCurrentDate(date) {
  const isoDateTime = new Date().toISOString()
  return isoDateTime.replace(/T/, ' ').replace(/\.\d+Z$/, '')
}