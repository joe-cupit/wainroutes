import "./WalkCard.css"

import { Link } from "react-router-dom"
import { displayDistance, displayElevation, getDistanceUnit, getDistanceValue, getElevationUnit, getElevationValue, metersToFeet } from "../utils/unitConversions"

import {ElevationIcon, HikingIcon, MountainIcon} from "../components/Icons"
import haversine from "../utils/haversine"



export default function WalkCard({ walk, link=true, distFrom=null }) {

  if (walk === null || walk === undefined) return <></>

  let distString = ""
  if (distFrom) {
    console.log(haversine(distFrom, [walk?.startLocation?.longitude, walk?.startLocation?.latitude]))
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
      {/* <img src={`/images/wainroutes-${walk?.photos?.baseId}${walk?.photos?.coverId}.jpeg`} /> */}
      <img src={`/images/${walk?.slug}.jpg`} />
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
