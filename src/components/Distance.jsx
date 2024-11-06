export default function Distance({ km }) {

  const useMiles = false

  return (
    useMiles ? `${(km / 1.609344).toFixed(1)}mi` : `${km}km`
  )
}
