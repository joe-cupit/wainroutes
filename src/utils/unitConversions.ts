const useMiles = false
const useFeet = false
const useFarenheit = false


export function getDistanceValue(kilometers : number | undefined, roundTo=4) {
  if (!kilometers) return 0;

  if (useMiles) return Number((kilometers / 1.609344).toFixed(roundTo));
  else return Number(Number(kilometers).toFixed(roundTo));
}
export function getDistanceUnit() {
  if (useMiles) return "mi"
  else return "km"
}
export function getSpeedUnit() {
  if (useMiles) return "mph"
  else return "kph"
}
export function displayDistance(kilometers : number | undefined, roundTo=2) {
  return getDistanceValue(kilometers).toFixed(roundTo) + getDistanceUnit()
}
export function displaySpeed(kilometers_per_hour : number | undefined, roundTo=0) {
  return getDistanceValue(kilometers_per_hour).toFixed(roundTo) + getSpeedUnit()
}


export function metersToFeet(meters : number | undefined) {
  if (!meters) return 0;

  return Number((meters * 3.280839895).toFixed(0))
}
export function getElevationValue(meters : number | undefined) {
  if (useFeet) return metersToFeet(meters)
  else return Number(Number(meters).toFixed(0))
}
export function getElevationUnit() {
  if (useFeet) return "ft"
  else return "m"
}
export function displayElevation(meters : number | undefined) {
  return getElevationValue(meters).toFixed(0) + getElevationUnit()
}


export function displayTemperature(celcius : number | undefined, includeUnit=true) {
  if (!celcius) return 0;

  if (useFarenheit) return `${((celcius * 9 / 5) + 32).toFixed(0)}°` + (includeUnit ? "F" : "")
  else return `${celcius.toFixed(0)}°` + (includeUnit ? "C" : "")
}
