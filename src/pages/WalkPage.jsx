import "./WalkPage.css";

import { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router-dom";

import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";

import { LakeMap, GeoRoute } from "../components/map";
import { useHillMarkers } from "../hooks/useMarkers";


export function WalkPage() {
  const { slug } = useParams();
  const walkData = useWalks(slug);
  const hillData = useHills(null);
  document.title = (walkData?.name ?? slug) + " | wainroutes";

  const hillMarkers = useHillMarkers(walkData?.wainwrights);

  const [gpxPoints, setGpxPoints] = useState(null);
  useEffect(() => {
    fetch(`/gpx/${slug}.gpx`)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(doc => {
        let coordinates = [];
        const nodes = [...doc.getElementsByTagName("trkpt")];
        nodes.forEach(node => {
          coordinates.push([parseFloat(node.getAttribute("lon")), parseFloat(node.getAttribute("lat"))])
        });
        setGpxPoints(coordinates);
      });
  }, [slug]);


  return (
    <main className="walk-page">

      <section>
        <div className="flex-column walk">
          <div className="walk-title">
            <Link to="/walks">&lt; back to walks</Link>
            <h1 className="title">{walkData?.name}</h1>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="2 -1.25 106 12.5" preserveAspectRatio="none">
              <path d="M5 5C22 2 38 2 55 5 71 8 88 8 105 5" fill="none"/>
            </svg>
          </div>

          <div className="flex-row walk-stats">
            <div>
              <h3>Length</h3>
              <p>{walkData?.distance + "km"}</p>
            </div>
            <div>
              <h3>Elevation</h3>
              <p>{walkData?.total_elevation + "m"}</p>
            </div>
            <div>
              <h3>Type</h3>
              <p>{walkData?.tags?.[0]}</p>
            </div>
            <div>
              <h3>Wainwrights</h3>
              <p className="walk-wainwrights">
                {walkData?.wainwrights?.map((hill, index) => {
                  return (
                    <Fragment key={index}>
                      <span>
                        <Link to={"/mountain/"+hill}>{hillData?.[hill]?.name}</Link>
                        {(index+1 < walkData?.wainwrights?.length ? "," : "")}
                      </span>
                      {(index+2 === walkData?.wainwrights?.length ? " and " : " ")}
                    </Fragment>
                  )
                })}
              </p>
            </div>
          </div>

          <p>{walkData?.intro}</p>

          <div className="flex-column walk-route">
            <div className="walk-map">
              <LakeMap
                gpxPoints={gpxPoints} mapMarkers={hillMarkers}
                defaultCenter={walkData?.start_lat_lang} defaultZoom={14} >
                  <GeoRoute points={gpxPoints} />
              </LakeMap>
            </div>
            <div className="walk-elevation">
            </div>
          </div>

          <WalkSteps steps={walkData?.steps} />
        </div>
      </section>

    </main>
  )
}


function WalkSteps({ steps }) {
  return (
    
    steps && Object.keys(steps).map((step, index) => {
      return (
        <div key={index}>
          <h2>{step}</h2>
          <p>{steps[step]?.text}</p>
        </div>
      )
    })
  )
}
