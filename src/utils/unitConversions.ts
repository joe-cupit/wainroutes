const useMiles = false;
const useFeet = false;
const useFarenheit = false;


export function getDistanceValue(kilometers : number | undefined, roundTo=4) {
  if (kilometers == undefined) return null;

  if (useMiles) return Number((kilometers / 1.609344).toFixed(roundTo));
  else return Number(Number(kilometers).toFixed(roundTo));
}
export function getDistanceUnit(long=false) {
  if (useMiles) return long ? "miles" : "mi";
  else return "km";
}
export function getSpeedUnit() {
  if (useMiles) return "mph";
  else return "kph";
}
export function displayDistance(kilometers : number | undefined, roundTo=2) {
  return (getDistanceValue(kilometers)?.toFixed(roundTo) ?? "N/A") + getDistanceUnit();
}
export function displaySpeed(kilometers_per_hour : number | undefined, roundTo=0) {
  return (getDistanceValue(kilometers_per_hour)?.toFixed(roundTo) ?? "N/A") + getSpeedUnit();
}


export function getElevationValue(meters : number | undefined) {
  if (meters == undefined) return null;

  if (useFeet) return Number((meters * 3.280839895).toFixed(0));
  else return Number(meters.toFixed(0));
}
export function getElevationUnit() {
  if (useFeet) return "ft";
  else return "m";
}
export function displayElevation(meters : number | undefined) {
  return (getElevationValue(meters)?.toFixed(0) ?? "N/A") + getElevationUnit();
}


export function displayTemperature(celcius : number | undefined, includeUnit=true) {
  if (celcius == undefined) return "N/A";

  if (useFarenheit) return `${((celcius * 9 / 5) + 32).toFixed(0)}°` + (includeUnit ? "F" : "");
  else return `${celcius.toFixed(0)}°` + (includeUnit ? "C" : "");
}
