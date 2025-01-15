

export function displayDistance(km) {
  const useMiles = false

  if (useMiles) return `${(km / 1.609344).toFixed(1)}mi`
  else return `${km}km`
}


export function displayElevation(m) {
  const useFeet = false

  if (useFeet) return `${(m * 3.280839895).toFixed(0)}ft`
  else return `${m}m`
}
