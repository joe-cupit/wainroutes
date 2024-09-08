import "./WalkPage.css";

import { useState, useEffect, Fragment } from "react";
import { Link, useParams } from "react-router-dom";

import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";

import { LakeMap, GeoRoute } from "../components/map";


export function WalkPage() {
  const { slug } = useParams();
  const walkData = useWalks(slug);
  document.title = (walkData?.name ?? slug) + " | wainroutes";

  const hillData = useHills(null);

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
    <main className="walk-page grid-group">
      <header className="walk-page_heading">
        <h1>{walkData?.name}</h1>
        <p>
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

      <section className="walk-page_intro">
        {walkData?.intro}
      </section>

      <section className="walk-page_details grid-group two-columns">
        <div className="walk-page_details-section grid-group two-columns">
          <div>Distance:</div>
          <div> {walkData?.distance}km</div>

          <div>Total elevation:</div>
          <div>{walkData?.total_elevation}m</div>

          <div>Wainwrights:</div>
          <div>{walkData?.wainwrights?.length}</div>

          <div>Estimated time:</div>
          <div>{walkData?.estimated_time}</div>
        </div>

        <div className="walk-page_details-section grid-group two-columns">
          <div>Start location:</div>
          <div>
            <div>{walkData?.start_lat_lang?.[0]?.toFixed(3) + ", " + walkData?.start_lat_lang?.[1]?.toFixed(3)}</div>
            {/* <div>{walkData?.start_grid_reference}</div> */}
            <div>
              <Link to={`https://what3words.com/${walkData?.start_what_three_words}`} target="_blank">{walkData?.start_what_three_words}</Link>
            </div>
            <div>{walkData?.start_post_code}</div>
          </div>

          <div>Bus connections:</div>
          <div className="bus-group flex-group flex-vertical-center">
            <BusRoutes busRoutes={walkData?.bus_routes} />
          </div>
        </div>
      </section>

      <section className="walk-page_map grid-group">
        <button className="flex-group flex-vertical-center">
          Download GPX
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clipRule="evenodd"/>
            <path fillRule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clipRule="evenodd"/>
          </svg>
        </button>
        <div className="walk-page_map-map">
          <LakeMap gpxPoints={gpxPoints} defaultCenter={walkData?.start_lat_lang} defaultZoom={14} >
            <GeoRoute points={gpxPoints} />
          </LakeMap>
        </div>
        <div className="walk-page_map-elevation">
          Elevation div
        </div>
      </section>

      <section className="walk-page_steps grid-group">
        {walkData?.steps && Object.keys(walkData?.steps).map((step, index) => {
          return (
            <div key={index} className="walk-page_steps-step">
              <h2>{step}</h2>
              <p>{walkData?.steps?.[step]}</p>
            </div>
          )
        })}
      </section>

      <section className="walk-page_extras">
        {walkData?.date && <div><b>Date completed:</b> {new Date(walkData?.date).toLocaleDateString()}</div>}
      </section>
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
                className="bus-group_bus-block"
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