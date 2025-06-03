import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useWalks } from "../../../hooks/useWalks";
import WalkCard from "../../../components/WalkCard";
import haversineDistance from "../../../utils/haversine";


export function NearbyWalks({ location, currentSlug } : { location: [number, number]; currentSlug: string }) {

  const allWalks = useWalks();
  const closestWalks = useMemo(() => {
    if (!allWalks) return [];

    for (let walk of allWalks) {
      if (walk.slug === currentSlug) {
        walk.distance = Infinity;
        continue;
      }

      walk.distance = haversineDistance(location, [walk.startLocation?.longitude ?? 0, walk.startLocation?.latitude ?? 0]) / 1000;
    }

    const orderedWalks = allWalks.sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));
    return orderedWalks.slice(0, 3);
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
                showDistance={true}
              />
            )
          })}
        </div>

        <Link to="/walks" className="primary button">View all walks</Link>
      </div>
    </section>
  )
}