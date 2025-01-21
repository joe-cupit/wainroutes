import "./WalkCard.css"

import { Link } from "react-router-dom"
import { displayDistance, displayElevation, getDistanceUnit, getDistanceValue, getElevationUnit, getElevationValue, metersToFeet } from "../utils/unitConversions"

import {ElevationIcon, HikingIcon, MountainIcon} from "../components/Icons"
import haversine from "../utils/haversine"
import Image from "./Image"



export default function WalkCard({ walk, link=true, distFrom=null }) {

  if (walk === null || walk === undefined) return <></>

  let distString = ""
  if (distFrom) {
    let dist = getDistanceValue(haversine(distFrom, [walk?.startLocation?.longitude, walk?.startLocation?.latitude]) / 1000)

    if (getDistanceUnit() === "km" && dist < 1) {
      distString = (dist * 1000).toFixed(0) + "m"
    }
    else if (getDistanceUnit() === "mi" && dist < 0.1) {
      distString = metersToFeet(dist * 1000) + "ft"
    }
    else {
      distString = dist.toFixed(1) + getDistanceUnit()
    }

    distString += " away"
  }


  const WalkCardContent = <>
    <div className="walk-card_image">
      <Image name={walk?.slug + "-" + walk?.gallery?.coverId} sizes="(min-width: 320px) 320px, 100vw" />
      {distFrom &&
        <p className="walk-card_dist">
          {distString}
        </p>
      }
    </div>

    <div className="walk-card_main flex-column gap-0">
      <h3 className="walk-card_title subheading">{walk.title}</h3>

      <p className="walk-card_intro">{walk.intro ?? "nothing to see here"}</p>

      <div className="walk-card_stats flex-row flex-apart gap-0">
        <div>
          <MountainIcon /> {walk.wainwrights?.length}
        </div>
        <div>
          <HikingIcon /> {displayDistance(walk.length, 1)}
        </div>
        <div>
          <ElevationIcon /> {displayElevation(walk.elevation)}
        </div>
      </div>
    </div>
  </>


  if (link) return (
    <Link to={"/walks/"+walk.slug}
      className="walk-card"
      title={walk?.title}
    >
      {WalkCardContent}
    </Link>
  )
  else return (
    <div className="walk-card">
      {WalkCardContent}
    </div>
  )
}
