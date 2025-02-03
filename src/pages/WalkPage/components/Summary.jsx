import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useHills } from "../../../hooks/useHills";
import { displayDistance, displayElevation } from "../../../utils/unitConversions";


export function Summary({ secRef, wainwrights, length, elevation, intro }) {

  const hillData = useHills(null);

  return (
    <div className="walk-page_summary" ref={secRef}>
      <h2 className="subheading visually-hidden" id="walk_overview">Summary</h2>
      <div className="walks-page_section flex-column">
        <div>
          <h3 className="smallheading">Wainwrights: </h3>
          <p className="walk-page_wainwrights">
            {wainwrights?.map((hill, index) => {
              return (
                <Fragment key={index}>
                  <span>
                    <Link to={"/wainwrights/"+hill}>{hillData?.[hill]?.name}</Link>
                    {(index+1 < wainwrights?.length ? "," : "")}
                  </span>
                  {(index+2 === wainwrights?.length ? " and " : " ")}
                </Fragment>
              )
            })}
          </p>
        </div>

        <div className="walk-page_summary flex-row">
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