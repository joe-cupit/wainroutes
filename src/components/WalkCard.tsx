import "./WalkCard.css";

import { Link } from "react-router-dom";

import { Walk } from "../pages/WalkPage/WalkPage";
import Image from "./Image";
import { ElevationIcon, HikingIcon, MountainIcon } from "./Icons";

import { displayDistance, displayElevation, getDistanceUnit, getDistanceValue } from "../utils/unitConversions";


export default function WalkCard({ walk, showDistance, hoverEvent } : { walk: Walk; showDistance?: boolean, hoverEvent?: CallableFunction }) {
  return (
    <article
      className="walks-card__container"
      onMouseEnter={() => hoverEvent && hoverEvent(walk.slug)}
      onMouseLeave={() => hoverEvent && hoverEvent(null)}
    >
      <Link to={"/walks/"+walk.slug} className="walks-card">
        <div className="walks-card__image">
          <Image
            name={walk?.slug + "_" + walk?.gallery?.coverId}
            sizes="(min-width: 22rem) 22rem, 100vw"
            maxWidth={512}
          />
          {(showDistance && walk.distance) &&
            <div className="walks-card__dist">
              {(getDistanceValue(walk.distance) ?? 1) < 1
                ? "Less than 1" + getDistanceUnit() + " away"
                : displayDistance(walk.distance, 1) + " away"
              }
            </div>
          }
        </div>
        <div className="walks-card__text">
          <div>
            <h3 className="subheading">{walk.title}</h3>
            <p style={{minHeight: "0.5lh"}}></p>
            {/* <p>This is a lovely walk, with a simple-ish description of the route and some cool things that you will be able to see on the route.</p> */}
          </div>
          <div className="walks-card__icons">
            <div className="walks-card__icons-icon wide">
              <HikingIcon />
              {displayDistance(walk.length, 1)}
            </div>
            <div className="walks-card__icons-icon wide">
              <ElevationIcon />
              {displayElevation(walk.elevation)}
            </div>
            <div className="walks-card__icons-icon">
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
