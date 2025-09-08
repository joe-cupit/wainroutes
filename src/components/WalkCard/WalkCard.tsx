import styles from "./WalkCard.module.css";

import Link from "next/link";

import Walk from "@/types/Walk";
import type { SimpleWalk } from "@/app/walks/page";

import LazyImage from "@/components/LazyImage/LazyImage";
import { displayDistance, displayElevation, getDistanceUnit, getDistanceValue } from "@/utils/unitConversions";
import { ElevationIcon, HikingIcon, MountainIcon } from "@/icons/WalkIcons";


type WalkCardProps = {
  walk: Walk | SimpleWalk;
  showDistance?: boolean;
  hoverEvent?: CallableFunction;
}


export default function WalkCard({ walk, showDistance, hoverEvent } : WalkCardProps) {
  
  if (hoverEvent) {}
  
  return (
    <article
      className={styles.container}
      // onMouseEnter={() => hoverEvent && hoverEvent(walk.slug)}
      // onMouseLeave={() => hoverEvent && hoverEvent(null)}
    >
      <Link href={"/walks/"+walk.slug} className={styles.walkCard}>
        <div className={styles.image}>
          <LazyImage
            name={walk?.slug + "_" + walk?.gallery?.coverId}
            sizes="(min-width: 22rem) 22rem, 100vw"
            maxWidth={512}
          />
          {(showDistance && walk.distance) &&
            <div className={styles.dist}>
              {(getDistanceValue(walk.distance) ?? 1) < 1
                ? "Less than 1" + getDistanceUnit() + " away"
                : displayDistance(walk.distance, 1) + " away"
              }
            </div>
          }
        </div>
        <div className={styles.text}>
          <div>
            <h3 className="subheading">{walk.title}</h3>
            <p style={{minHeight: "0.5lh"}}></p>
            {/* <p>This is a lovely walk, with a simple-ish description of the route and some cool things that you will be able to see on the route.</p> */}
          </div>
          <div className={styles.icons}>
            <div className={`${styles.iconsIcon} ${styles.wide}`}>
              <HikingIcon />
              {displayDistance(walk.length, 1)}
            </div>
            <div className={`${styles.iconsIcon} ${styles.wide}`}>
              <ElevationIcon />
              {displayElevation(walk.elevation)}
            </div>
            <div className={styles.iconsIcon}>
              {walk.wainwrights?.length ?? "0"}
              <MountainIcon />
              {/* {walk.wainwrights?.length
                ? walk.wainwrights?.length + " Wainwright" + (walk.wainwrights?.length === 1 ? "" : "s")
                : "0"
              } */}
            </div>
          </div>
          {/* <Link to={"/walks/"+walk.slug} className="button">View walk</Link> */}
        </div>
      </Link>
    </article>
  )
}
