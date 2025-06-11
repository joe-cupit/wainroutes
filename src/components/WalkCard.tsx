import "./WalkCard.css";

import { Link } from "react-router-dom";

import { Walk } from "../pages/WalkPage/WalkPage";
import Image from "./Image";
import { ElevationIcon, HikingIcon, MountainIcon } from "./Icons";

import { displayDistance, displayElevation, getDistanceUnit, getDistanceValue } from "../utils/unitConversions";


export default function WalkCard({ walk, showDistance, hoverEvent } : { walk: Walk; showDistance?: boolean, hoverEvent?: CallableFunction }) {
  return (
    <article
      className="walks-card"
      onMouseEnter={() => hoverEvent && hoverEvent(walk.slug)}
      onMouseLeave={() => hoverEvent && hoverEvent(null)}
    >
      <div className="walks-card__image">
        <Image
          name={walk?.slug + "_" + walk?.gallery?.coverId}
          sizes="(min-width: 22rem) 22rem, 100vw"
          maxWidth={512}
        />
        {(showDistance && walk.distance) &&
          <div className="walks-card__dist">
            {getDistanceValue(walk.distance) < 1
              ? "Less than 1" + getDistanceUnit()
              : displayDistance(walk.distance, 1) + " away"
            }
          </div>
        }
      </div>

      <div className="walks-card__text">
        <h3 className="subheading">{walk.title}</h3>
        <div className="walks-card__icons flex-row">
          <div className="flex-row gap-0 align-center">
            <HikingIcon />
            {displayDistance(walk.length, 1)}
          </div>
          <div className="flex-row gap-0 align-center">
            <ElevationIcon />
            {displayElevation(walk.elevation)}
          </div>
          <div className="flex-row gap-0 align-center">
            <MountainIcon />
            {walk.wainwrights?.length ?? "N/A"}
          </div>
        </div>

        <Link to={"/walks/"+walk.slug} className="button">View walk</Link>
      </div>
    </article>
  )
}
