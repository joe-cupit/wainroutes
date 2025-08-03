import styles from "../Walk.module.css";
import fontStyles from "@/app/fonts.module.css";
import buttonStyles from "@/app/buttons.module.css";

import Link from "next/link";

import Walk from "@/types/Walk";
import haversineDistance from "@/utils/haversineDistance";
import WalkCard from "@/app/components/WalkCard/WalkCard";
import WalkCardStyles from "@/app/components/WalkCard/WalkCard.module.css";

import tempwalks from "@/data/walks.json";


export default function NearbyWalks({ location, currentSlug } : { location: [number, number]; currentSlug: string }) {

  const allWalks = tempwalks as unknown as Walk[];
  const getClosestWalks = () => {
    for (const walk of allWalks) {
      if (walk.slug === currentSlug) {
        walk.distance = Infinity;
        continue;
      }

      walk.distance = haversineDistance(location, [walk.startLocation?.longitude ?? 0, walk.startLocation?.latitude ?? 0]) / 1000;
    }

    const orderedWalks = allWalks.sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999));
    return orderedWalks.slice(0, 3);
  }

  const closestWalks = getClosestWalks();


  return (
    <section id="nearby-walks" className={styles.nearby}>
      <div className={styles.nearbyMain}>
        <h2 className={fontStyles.heading}>Nearby Walks</h2>

        <div className={`${WalkCardStyles.group} ${styles.nearbyWalks}`}>
          {closestWalks.map((walk, index) => {
            return (
              <WalkCard key={index}
                walk={walk} // link={false}
                showDistance={true}
              />
            )
          })}
        </div>

        <Link href="/walks" className={`${buttonStyles.button} ${buttonStyles.primary}`}>View all walks</Link>
      </div>
    </section>
  )
}