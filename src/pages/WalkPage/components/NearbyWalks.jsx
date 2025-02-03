import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useWalks } from "../../../hooks/useWalks"
import WalkCard from "../../../components/WalkCard"
import haversineDistance from "../../../utils/haversine"


export function NearbyWalks({ location, currentSlug }) {

  const closestWalks = useMemo(() => {
    let walks = useWalks()

    for (let walkSlug of Object.keys(walks)) {
      if (walkSlug === currentSlug) {
        walks[walkSlug].distanceFromLocation = Infinity
        continue
      }

      walks[walkSlug].distanceFromLocation = haversineDistance(location, [walks[walkSlug].startLocation?.longitude, walks[walkSlug].startLocation?.latitude])
    }

    const orderedWalks = Object.values(walks).sort((a, b) => a.distanceFromLocation - b.distanceFromLocation)
    return orderedWalks.slice(0, 3)
  }, [location])


  return (
    <section className="walk-page_nearby">
      <div className="flex-column align-center">
        <h2 className="heading">Nearby Walks</h2>

        <div className="walk-page_nearby-walks">
          {closestWalks.map((walk, index) => {
            return (
              <WalkCard key={index}
                walk={walk} // link={false}
                distFrom={location}
              />
            )
          })}
        </div>

        <Link to="/walks" className="primary button">View all walks</Link>
      </div>
    </section>
  )
}