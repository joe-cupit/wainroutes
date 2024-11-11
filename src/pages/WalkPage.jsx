import "./WalkPage.css";

import { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router-dom";

import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";

import { LakeMap, GeoRoute } from "../components/map";
import { useHillMarkers } from "../hooks/useMarkers";
import Distance from "../components/Distance";
import Height from "../components/Height";


export function WalkPage() {
  const { slug } = useParams();
  const walkData = useWalks(slug);
  const hillData = useHills(null);
  document.title = (walkData?.title ?? "A Lake District Walk") + " | wainroutes";

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
            <h1 className="title">{walkData?.title}</h1>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="2 -1.25 106 12.5" preserveAspectRatio="none">
              <path d="M5 5C22 2 38 2 55 5 71 8 88 8 105 5" fill="none"/>
            </svg>
          </div>

          <div className="flex-row walk-stats">
            <div>
              <h3>Length</h3>
              <p><Distance km={walkData?.length} /></p>
            </div>
            <div>
              <h3>Elevation</h3>
              <p><Height m={walkData?.elevation} /></p>
            </div>
            <div>
              <h3>Type</h3>
              <p>{walkData?.type}</p>
            </div>
            <div>
              <h3>Wainwrights</h3>
              <p className="walk-wainwrights">
                {walkData?.wainwrights?.map((hill, index) => {
                  return (
                    <Fragment key={index}>
                      <span>
                        <Link to={"/wainwrights/"+hill}>{hillData?.[hill]?.name}</Link>
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
    
    steps && steps.map((step, index) => {
      return (
        <div key={index}>
          <p>{step}</p>
        </div>
      )
    })
  )
}
