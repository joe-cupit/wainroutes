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
export function displayDistance(kilometers) {
  return getDistanceValue(kilometers).toFixed(2) + getDistanceUnit()
}


export function getElevationValue(meters) {
  if (useFeet) return Number((meters * 3.280839895).toFixed(0))
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
