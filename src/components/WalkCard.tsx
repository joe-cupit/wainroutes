import "./WalkCard.css";

import { Link } from "react-router-dom";

import { Walk } from "../pages/WalkPage/WalkPage";
import {ElevationIcon, HikingIcon, MountainIcon} from "../components/Icons";
import Image from "./Image";

import { displayDistance, displayElevation, getDistanceUnit, getDistanceValue, metersToFeet } from "../utils/unitConversions";
import haversine from "../utils/haversine";



export default function WalkCard({ walk, link=true, distFrom, onHover=null } : { walk: Walk; link?: boolean; distFrom?: [number, number]; onHover?: CallableFunction | null }) {

  if (walk === null || walk === undefined) return <></>;

  let distString = "";
  if (distFrom) {
    let dist = getDistanceValue(haversine(distFrom, [walk?.startLocation?.longitude ?? 0, walk?.startLocation?.latitude ?? 0]) / 1000);

    if (dist < 1) {
      distString = "Less than 1" + getDistanceUnit();
    }
    else {
      distString = dist.toFixed(1) + getDistanceUnit() + " away";
    }

    // if (getDistanceUnit() === "km" && dist < 1) {
    //   distString = (dist * 1000).toFixed(0) + "m"
    // }
    // else if (getDistanceUnit() === "mi" && dist < 0.1) {
    //   distString = metersToFeet(dist * 1000) + "ft"
    // }
    // else {
    //   distString = dist.toFixed(1) + getDistanceUnit()
    // }

    // distString += " away"
  }


  const WalkCardContent = <>
    <div className="walk-card_image">
      <Image
        name={walk?.slug + "_" + walk?.gallery?.coverId}
        sizes="(min-width: 320px) 320px, 100vw"
        maxWidth={1024}
      />
      {distFrom &&
        <span className="walk-card_dist">
          {distString}
        </span>
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
      {...(onHover ? {onMouseEnter: () => onHover(true), onMouseLeave: () => onHover()} : {} )}
      aria-label={walk?.title}
    >
      {WalkCardContent}
    </Link>
  )
  else return (
    <div
      className="walk-card"
      {...(onHover ? {onMouseEnter: () => onHover(true), onMouseLeave: () => onHover()} : {} )}
    >
      {WalkCardContent}
    </div>
  )
}


export function WalkCardWide({ walk, link=true, distFrom, onHover=null } : { walk: Walk; link?: boolean; distFrom?: [number, number]; onHover?: CallableFunction | null }) {

  if (walk === null || walk === undefined) return <></>;

  let distString = "";
  if (distFrom) {
    let dist = getDistanceValue(haversine(distFrom, [walk?.startLocation?.longitude ?? 0, walk?.startLocation?.latitude ?? 0]) / 1000);

    if (getDistanceUnit() === "km" && dist < 1) {
      distString = (dist * 1000).toFixed(0) + "m";
    }
    else if (getDistanceUnit() === "mi" && dist < 0.1) {
      distString = metersToFeet(dist * 1000) + "ft";
    }
    else {
      distString = dist.toFixed(1) + getDistanceUnit();
    }

    distString += " away";
  }


  const WalkCardContent = <>
    <div className="walk-card-wide_image">
      <Image name={walk?.slug + "_" + walk?.gallery?.coverId} sizes="(min-width: 200px) 200px, 40vw" />
      {distFrom &&
        <p className="walk-card-wide_dist">
          {distString}
        </p>
      }
    </div>

    <div className="walk-card-wide_main flex-row wrap-none gap-0">
      <div className="walk-card-wide_title-intro flex-1">
        <h3 className="walk-card-wide_title subheading">{walk.title}</h3>

        <p className="walk-card-wide_intro">{walk.intro ?? "..."}</p>
      </div>

      <div className="walk-card-wide_stats flex-column gap-0">
        <div title={"Route length: " + displayDistance(walk.length, 1)}>
          {displayDistance(walk.length, 1)} <HikingIcon />
        </div>
        <div title={"Elevation gain: " + displayElevation(walk.elevation)}>
          {displayElevation(walk.elevation)} <ElevationIcon />
        </div>
        <div title={walk.wainwrights?.length + " Wainwrights"}>
          {walk.wainwrights?.length} <MountainIcon />
        </div>
      </div>
    </div>
  </>


  if (link) return (
    <Link to={"/walks/"+walk.slug}
      className="walk-card-wide"
      title={walk?.title}
      onMouseEnter={onHover ? () => onHover(true) : () => {}}
      onMouseLeave={onHover ? () => onHover() : () => {}}
    >
      {WalkCardContent}
    </Link>
  )
  else return (
    <div
      className="walk-card-wide"
      onMouseEnter={onHover ? () => onHover(true) : () => {}}
      onMouseLeave={onHover ? () => onHover() : () => {}}
    >
      {WalkCardContent}
    </div>
  )
}
