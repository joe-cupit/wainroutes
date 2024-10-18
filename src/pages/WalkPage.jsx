import "./WalkPage.css";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";

import { LakeMap, GeoRoute } from "../components/map";
import { useHillMarkers } from "../hooks/useMarkers";
// import Gallery from "../components/Gallery";


export function WalkPage() {
  const { slug } = useParams();
  const walkData = useWalks(slug);
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

  // const [recentlyCopied, setRecentlyCopied] = useState(false);
  // function copyToClipboard() {
  //   navigator.clipboard.writeText(`wainroutes.co.uk/walk/${walkData?.slug}`);

  //   setRecentlyCopied(true)
  //   setTimeout(() => setRecentlyCopied(false), 3000);
  // }


  return (
    <main className="walk">
      <div className="walk-header">
        <h1>{walkData?.name}</h1>
        <MountainList mountains={walkData?.wainwrights} />
      </div>

      <div className="walk-stats">
        <div>
          <span>Length</span>
          <span>{walkData?.distance}km</span>
        </div>
        <div>
          <span>Elevation</span>
          <span>{walkData?.total_elevation}m</span>
        </div>
        <div>
          <span>Wainwrights</span>
          <span>{walkData?.wainwrights?.length}</span>
        </div>
        <div>
          <span>Estimated time</span>
          <span>{walkData?.estimated_time}</span>
        </div>
      </div>

      <div className="walk-wrapper">
        <div className="walk-main">
          <p>{walkData?.intro}</p>

          <div className="walk-route">
            <button>
              Download GPX
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clipRule="evenodd"/>
                <path fillRule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clipRule="evenodd"/>
              </svg>
            </button>
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

          <div className="walk-description">
            <WalkSteps steps={walkData?.steps} />
          </div>
        </div>

        <aside>
          <p>Info</p>
          <p>Route</p>
          <p>Details</p>
          <p>Weather</p>
          <p>Travel</p>
          <p>Other</p>

          <BusRoutes busRoutes={walkData?.bus_routes} />
          {walkData?.date && <div><b>Date completed:</b> {new Date(walkData?.date).toLocaleDateString()}</div>}
        </aside>
      </div>

    </main>
  )
}


function MountainList({ mountains }) {
  const hillData = useHills(null);

  return (
    <ul>
      {mountains?.map((hill, index) => {
        return (
          <li key={index}>
            <Link to={`/mountain/${hill}`}>{hillData?.[hill]?.name ?? hill}</Link>
          </li>
        )
      })}
    </ul>
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


function BusRoutes({ busRoutes }) {
  return (
    <div className="bus-group">
      {busRoutes && busRoutes.length > 0
      ? busRoutes.map((bus, index) => {
          const number = bus[0];
          const from = bus[1];
          return (
            <div key={index}
                 className="bus-number"
                 fromtext={from}
                 style={{"backgroundColor": `var(--bus-${number})`}}>
              {number}
            </div>
          )
        })
      : "None"}
    </div>
  )
}
