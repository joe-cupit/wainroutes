import "./WalkCard.css"

import { Link } from "react-router-dom"
import { displayDistance, displayElevation } from "../utils/unitConversions"

import {ElevationIcon, HikingIcon, MountainIcon} from "../components/Icons"



export default function WalkCard({ walk, link=true, dist=0 }) {

  const WalkCardContent = <>
    <div className="walk-card_image">
      <img src={"/images/wainroutes-2701230"+(4)+".JPEG"} />
      {dist > 0 &&
        <p className="walk-card_dist">
          {walk.distanceFromLocation < 1000 ? walk.distanceFromLocation.toFixed(0)+"m" : (walk.distanceFromLocation / 1000).toFixed(1)+"km"} away
        </p>
      }
    </div>

    <div className="walk-card_main flex-column gap-0">
      <h3 className="walk-card_title subheading">{walk.title}</h3>

      <p className="walk-card_intro">{walk.intro ?? "nothing to see here"}</p>

      <div className="walk-card_stats flex-row flex-apart">
        <div>
          <MountainIcon /> {walk.wainwrights?.length}
        </div>
        <div>
          <HikingIcon /> {displayDistance(walk.length)}
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
