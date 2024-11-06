export default function Height({ m }) {

  const useFeet = false

  return (
    useFeet ? `${(m * 3.280839895).toFixed(0)}ft` : `${m}m`
  )
}
