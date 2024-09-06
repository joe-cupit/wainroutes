import "../styles/walk.css";

import { Link, useParams } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { LakeMap, GeoRoute } from "../map/map";
import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";


export function WalkPage() {
  const { slug } = useParams();
  const walkData = useWalks(slug);
  document.title = (walkData?.name ?? slug) + " | wainroutes";

  const hillData = useHills(null);

  const [gpxPoints, setGpxPoints] = useState(null);
  useEffect(() => {
    fetch(`/tmp/${slug}.gpx`)
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
    {!walkData
    ? <header className="walk-page--header">
        <h1 className="walk-page--title text--heading">{"This walk doesn't {yet} exist"}</h1>
        <p className="walk-page--intro text--default">Did you mean... ?</p>
      </header>
    : <>
      <header className="walk-page--header">
        <h1 className="walk-page--title text--heading">{walkData?.name}</h1>
        <p className="walk-page--wainwrights text--subtext">
          {walkData?.wainwrights?.map((wain, index) => {
            return (
              <Fragment key={index}>
                <Link to={`/mountain/${wain}`} className="walk-page--mountain">
                  {hillData ? hillData?.[wain]?.name : wain}
                </Link>
                {index !== walkData?.wainwrights?.length-1 && " / "}
              </Fragment>
            )
          })}
        </p>
      </header>

      <section className="walk-page--intro text--default">
        {walkData?.intro}
      </section>

      <section className="walk-page--details text--default">
        <div className="walk-page--details-grid">
          <div className="length">Distance:</div>
          <div> {walkData?.distance}km</div>

          <div className="elevation">Total elevation:</div>
          <div>{walkData?.total_elevation}m</div>

          <div className="elevation">Wainwrights:</div>
          <div>{walkData?.wainwrights?.length}</div>

          <div className="elevation">Estimated time:</div>
          <div>{walkData?.estimated_time}</div>
        </div>

        <div className="walk-page--details-grid">
          <div className="start-location">Start location:</div>
          <div>
            <div>{walkData?.start_lat_lang?.[0]?.toFixed(3) + ", " + walkData?.start_lat_lang?.[1]?.toFixed(3)}</div>
            {/* <div>{walkData?.start_grid_reference}</div> */}
            <div>
              <Link to={`https://what3words.com/${walkData?.start_what_three_words}`} target="_blank">{walkData?.start_what_three_words}</Link>
            </div>
            <div>{walkData?.start_post_code}</div>
          </div>

          <div className="bus-section">Bus connections:</div>
          <div className="bus-section--list font--urbanist">
            <BusRoutes busRoutes={walkData?.bus_routes} />
          </div>
        </div>
      </section>

      <section className="walk-page--route-section">
        <button className="walk-page--gpx-download">
          Download GPX
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clipRule="evenodd"/>
            <path fillRule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clipRule="evenodd"/>
          </svg>
        </button>
        <div className="walk-page--map-container">
          <LakeMap gpxPoints={gpxPoints} defaultCenter={walkData?.start_lat_lang} defaultZoom={14} >
            <GeoRoute points={gpxPoints} />
          </LakeMap>
        </div>
        <div style={{height: "200px", background: "var(--foreground)", marginTop: "0.5rem", textAlign: "center", paddingTop: "80px", borderRadius: "0.3rem"}}>
          Elevation div
        </div>
      </section>

      <section className="walk-page--steps-section">
        {walkData?.steps && Object.keys(walkData?.steps).map((step, index) => {
          return (
            <div key={index} className="walk-page--step">
              <h2 className="walk-page--step-title text--subheading">{step}</h2>
              <p className="walk-page--step-content text--default">{walkData?.steps?.[step]}</p>
            </div>
          )
        })}
      </section>

      <section className="walk-page--extra-details">
        {walkData?.date && <div><b>Date completed:</b> {new Date(walkData?.date).toLocaleDateString()}</div>}
      </section>
      </>
    }
  </main>
  )
}


function BusRoutes({ busRoutes }) {
  return (
  <>
    {busRoutes && busRoutes.length > 0
    ? busRoutes.map((bus, index) => {
        const number = bus[0];
        const from = bus[1];
        return (
          <div key={index}
                className="bus-block text--secondary"
                fromtext={from}
                style={{"backgroundColor": `var(--bus-${number})`}}>
            {number}
          </div>
        )
      })
    : "None"
    }
  </>
  )
}
