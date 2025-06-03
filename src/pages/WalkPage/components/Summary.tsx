import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";

import { Walk } from "../WalkPage";

import { useHills } from "../../../contexts/HillsContext";
import { displayDistance, displayElevation } from "../../../utils/unitConversions";


export function Summary({ secRef, title, titleRef, wainwrights, length, elevation, intro } : { secRef: React.RefObject<HTMLDivElement>; title: Walk["title"]; titleRef: React.RefObject<HTMLHeadingElement>; wainwrights: Walk["wainwrights"]; length: Walk["length"]; elevation: Walk["elevation"]; intro: Walk["intro"] }) {

  const hillsData = useHills().hills;
  const hillNames = useMemo(() => {
    if (!hillsData) return;

    return Object.fromEntries(hillsData.map(hill => [hill.slug, hill.name]))
  }, [hillsData])

  return (
    <div className="walk-page_summary" ref={secRef}>
      <h1 className="title" ref={titleRef}>{title}</h1>

      <h2 className="subheading visually-hidden" id="walk_overview">Summary</h2>
      <div className="walks-page_section flex-column">
        <div className={(wainwrights?.length ?? 0) <= 2 ? "walk-page_summary_horizontal-group" : ""}>
          <h3 className="smallheading">Wainwrights: </h3>
          <p className="walk-page_wainwrights">
            {wainwrights?.map((hill, index) => {
              return (
                <Fragment key={index}>
                  <span>
                    <Link to={"/wainwrights/"+hill}>{hillNames?.[hill]}</Link>
                    {(index+1 < wainwrights?.length ? "," : "")}
                  </span>
                  {(index+2 === wainwrights?.length ? " and " : " ")}
                </Fragment>
              )
            })}
          </p>
        </div>

        <div className="walk-page_summary_horizontal-group flex-row">
          <div>
            <h3 className="smallheading">Distance: </h3>
            <p>{displayDistance(length)}</p>
          </div>
          <div>
            <h3 className="smallheading">Elevation: </h3>
            <p>{displayElevation(elevation)}</p>
          </div>
        </div>

        <div>
          <h3 className="smallheading" style={{display: "block"}}>Overview: </h3>
          <p>{intro ?? "N/A"}</p>
        </div>
      </div>
    </div>
  )
}