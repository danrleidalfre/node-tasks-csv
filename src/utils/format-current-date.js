export function formatCurrentDate() {
  let date = new Date()
  date = new Date(date.valueOf() - date.getTimezoneOffset() * 60000)
  return date.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, '')
}