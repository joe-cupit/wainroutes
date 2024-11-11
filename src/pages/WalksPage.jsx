import "./WalksPage.css";

import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useWalks } from "../hooks/useWalks";

import { LakeMap } from "../components/map";
import Height from "../components/Height";
import Distance from "../components/Distance";

import hillData from "../assets/hillData";
import { useWalkMarkers } from "../hooks/useMarkers";

const previewImages = require.context("../assets/previews")
const previews = Object.fromEntries(previewImages.keys().map(image => [image.substring(2, image.length-4), previewImages(image)]));



export function WalksPage() {

  document.title = "Lake District Walks | wainroutes";

  const walkMarkers = useWalkMarkers(null);
  const walkData = Object.values(useWalks(null));
  const [sortValue, setSortValue] = useState("recommended");

  const sortedWalkData = useMemo(() => {
    if (sortValue === null || sortValue === "recommended") return walkData;

    const [type, dir] = sortValue.split("-");
  
    let newWalkData = [...walkData];
    switch (type) {
      case "hills":
        newWalkData.sort((a, b) => a.wainwrights?.length - b.wainwrights?.length);
        break;
      case "ele":
        newWalkData.sort((a, b) => a.total_elevation - b.total_elevation);
        break;
      case "dist":
        newWalkData.sort((a, b) => a.distance - b.distance);
        break;
      default:
        break;
    }

    if (dir === "dsc") {
      newWalkData.reverse();
    }

    return newWalkData;
  }, [walkData, sortValue]);


  const [hovered, setHovered] = useState(null);


  return (
    <main className="walks-page">

      <section>
        <div className="flex-column">
          <h1 className="title">Find a Walk</h1>

          <input type="text" placeholder="search for a walk..." />

          <div className="flex-row wrap-none">
            <div className="flex-column walks-page-main">
              <div className="flex-row align-center justify-apart">
                <span className="walks-desktop-only">
                  {walkData ? "Showing "+walkData.length+" of "+walkData.length+" walks" : ""}
                </span>
                <span>
                  Sort by: <select type="select" value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
                    <option value="recommended">Recommended</option>
                    <option value="hills-dsc">Most Wainwrights</option>
                    <option value="hills-asc">Least Wainwrights</option>
                    <option value="dist-asc">Distance (Asc.)</option>
                    <option value="dist-dsc">Distance (Dsc.)</option>
                    <option value="ele-asc">Elevation (Asc.)</option>
                    <option value="ele-dsc">Elevation (Dsc.)</option>
                  </select>
                </span>
              </div>
              <div className="flex-column walks-page-list">
                {(sortedWalkData.length > 0)
                ? sortedWalkData?.map((walk, key) => {
                    return (
                      <div onMouseEnter={() => setHovered(walk.slug)} onMouseLeave={() => setHovered(null)}>
                        <WalkCard key={key} walk={walk} />
                      </div>
                    )
                  })
                : <div>No walks match these filters.</div>
                }
                <p className="secondary-text">
                  {walkData.length > 0 ? "• Showing "+walkData.length+" lovely walks in the Lake District •" : ""}
                </p>
              </div>
            </div>
            <div className="walks-page-map">
              <LakeMap mapMarkers={walkMarkers} activePoint={hovered} />
            </div>
          </div>
        </div>        
      </section>

    </main>
  )
}


export default function WalkCard({ walk }) {
  const hills = [...walk?.wainwrights].sort((a, b) => hillData[b].height - hillData[a].height);

  return (
    <Link to={`/walks/${walk.slug}`} className="flex-row walks-card">

      <div className="walks-card_image walks-desktop-only">
        <img src={previews[walk.slug]} alt={walk.title+" preview"} loading="lazy" />
      </div>

      <div className="flex-column gap-0 walks-card_text">
        <h3 className="subheading" title={walk?.title}>{walk?.title}</h3>
        <MountainList mountains={hills} />
        <p className="flex-row secondary-text walks-card_stats">
          <span className="walks-card-stat-group">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" viewBox="0 0 100 125">
              <circle cx="46" cy="12.6" r="10.1"/>
              <path d="M74.9,41.4l-9.1-3.5l-6.5-8c-2.3-2.8-5.7-4.4-9.3-4.4h-8.4c-3.3,0-6.5,1.4-8.8,3.8L26,36.7c-0.6,0.6-0.9,1.3-1.1,2.1     l-2.5,12.1c-0.5,2.4,1,4.8,3.5,5.3c0.3,0.1,0.6,0.1,0.9,0.1c2.1,0,3.9-1.5,4.4-3.6l2.3-10.8l3-3.2v19.1l-2.2,14.3l-9.8,17.6     c-1.4,2.5-0.5,5.7,2,7.1c0.8,0.5,1.7,0.7,2.5,0.7c1.8,0,3.6-1,4.6-2.7l10.3-18.4c0.3-0.5,0.5-1.1,0.6-1.8l2-12.8l8.6,14.6     l3.3,16.8c0.5,2.5,2.7,4.2,5.1,4.2c0.3,0,0.7,0,1-0.1c2.8-0.6,4.7-3.3,4.1-6.1L65,73.6c-0.1-0.6-0.3-1.1-0.6-1.6l-8.9-15.2V39.5     l4,5c0.5,0.6,1.1,1.1,1.9,1.4l10.2,3.9c2.3,0.9,4.9-0.3,5.8-2.6C78.4,44.8,77.2,42.3,74.9,41.4z"/>
            </svg>
            <Distance km={walk?.length} />
          </span>
          •
          <span className="walks-card-stat-group">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
            <Height m={walk?.elevation} />
          </span>
          •
          <span className="walks-card-stat-group">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {walk?.estimatedTime}
          </span>
          •
          <span className="walks-card-stat-group">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" viewBox="0 0 100 125">
              <polygon points="59.811,100 19.623,100 39.717,65.194 59.811,30.391 79.906,65.194 100,100  "/>
              <polygon points="35.658,60.679 29.18,49.457 14.59,74.729 0,100 12.958,100 33.051,65.194  "/>
            </svg>            
            {walk?.wainwrights?.length}
          </span>
        </p>
      </div>
    </Link>
  )
}


function MountainList({ mountains, container } ) {

  const hillMap = mountains.length > 4 ? mountains.slice(0, 3) : mountains;
  const remainingHills = mountains.length - hillMap.length;

  return (
    <p>
      {hillMap?.map((hill, index) => {
        return (
          <Fragment key={index}>
            {(index !== 0 ? ", " : "") + hillData?.[hill]?.name}
          </Fragment>
        )
      })}
      {remainingHills ? (" & " + (remainingHills) + " more") : ""}
    </p>
  )
}
