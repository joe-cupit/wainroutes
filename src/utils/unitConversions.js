const useMiles = false
const useFeet = false
const useFarenheit = false


export function getDistanceValue(kilometers) {
  if (useMiles) return Number((kilometers / 1.609344).toFixed(4))
  else return Number(Number(kilometers).toFixed(4))
}
export function getDistanceUnit() {
  if (useMiles) return "mi"
  else return "km"
}
export function getSpeedUnit() {
  if (useMiles) return "mph"
  else return "kph"
}
export function displayDistance(kilometers, roundTo=2) {
  return getDistanceValue(kilometers).toFixed(roundTo) + getDistanceUnit()
}
export function displaySpeed(kilometers_per_hour, roundTo=0) {
  return getDistanceValue(kilometers_per_hour).toFixed(roundTo) + getSpeedUnit()
}


export function metersToFeet(meters) {
  return Number((meters * 3.280839895).toFixed(0))
}
export function getElevationValue(meters) {
  if (useFeet) return metersToFeet(meters)
  else return Number(Number(meters).toFixed(0))
}
export function getElevationUnit() {
  if (useFeet) return "ft"
  else return "m"
}
export function displayElevation(meters) {
  return getElevationValue(meters).toFixed(0) + getElevationUnit()
}


export function displayTemperature(celcius, includeUnit=true) {
  if (useFarenheit) return `${((celcius * 9 / 5) + 32).toFixed(0)}°` + (includeUnit ? "F" : "")
  else return `${celcius.toFixed(0)}°` + (includeUnit ? "C" : "")
}
