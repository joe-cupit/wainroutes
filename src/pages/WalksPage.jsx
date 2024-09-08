import "./WalksPage.css";

import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useWalks } from "../hooks/useWalks";

import { LakeMap } from "../components/map";

import hillData from "../assets/hillData";
const previewImages = require.context("../assets/previews")
const previews = Object.fromEntries(previewImages.keys().map(image => [image.substring(2, image.length-4), previewImages(image)]));



export function WalksPage() {

  document.title = "Lake District Walks | wainroutes";

  const walkData = Object.values(useWalks(null));
  const [sortValue, setSortValue] = useState("recommended");
  const [filterValues, setFilterValues] = useState({
    distance: [0, 100],
    duration: [0, 100],
    wainwrights: [0, 100],
    types: []
  });

  const filteredWalkData = useMemo(() => {
    let newWalkData = [...walkData];

    if (filterValues?.distance) {
      const [distMin, distMax] = filterValues.distance;
      newWalkData = newWalkData.filter(walk => (walk.distance >= distMin) && (walk.distance <= distMax))
    }
    if (filterValues?.duration) {
      const [durMin, durMax] = filterValues.duration;
      newWalkData = newWalkData.filter(walk => {
        const [estMinS, estMaxS] = walk.estimated_time.split("-");
        const estMin = parseFloat(estMinS.split(":")[0]) + parseFloat(estMinS.split(":")[1])/60;
        const estMax = parseFloat(estMaxS.split(":")[0]) + parseFloat(estMaxS.split(":")[1])/60;
        return ((estMin >= durMin) && (estMin < durMax)) || ((estMax > durMin) && (estMax <= durMax));
      })
    }
    if (filterValues?.wainwrights) {
      const [wainMin, wainMax] = filterValues.wainwrights;
      newWalkData = newWalkData.filter(walk => (walk.wainwrights?.length >= wainMin) && (walk.wainwrights?.length <= wainMax))
    }
    if (filterValues?.types?.length > 0) {
      const validTypes = filterValues.types;
      newWalkData = newWalkData.filter(walk => walk.tags?.some(tag => validTypes.includes(tag)))
    }

    return newWalkData;
  }, [walkData, filterValues])

  const sortedWalkData = useMemo(() => {
    if (sortValue === null || sortValue === "recommended") return filteredWalkData;

    const [type, dir] = sortValue.split("-");
  
    let newWalkData = [...filteredWalkData];
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
  }, [filteredWalkData, sortValue]);

  return (
    <main className="walks-page grid-group">
      <h1>walks</h1>

      <section className="walks-page_intro grid-group two-columns">
        <LakeMap />
        <div>
          tmp
        </div>
      </section>

      <section className="walks-page_walks grid-group">
        <h2>All Walks</h2>

        <input type="text" className="walks-page_search" placeholder="search for a walk..." />

        <div className="flex-group flex-space flex-vertical-center">
          <span className="walks-page_desktop-only">
            {filteredWalkData ? "Showing "+filteredWalkData.length+" of "+walkData.length+" walks" : ""}
          </span>
          <span>
            Sort by: 
            <select type="select" value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
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
        <div className="walks-page_list grid-group">
          {(sortedWalkData.length > 0)
          ? sortedWalkData?.map((walk, key) => {
              return <WalkCard key={key} walk={walk} />
            })
          : <div>No walks match these filters.</div>
          }
          <p>
            {filteredWalkData.length > 0 ? "• Showing "+filteredWalkData.length+" lovely walks in the Lake District •" : ""}
          </p>
        </div>
      </section>
    </main>
  )
}


export default function WalkCard({ walk }) {
  const hills = [...walk?.wainwrights].sort((a, b) => hillData[b].height - hillData[a].height);

  const toggleFavourite = (e) => {
    e.preventDefault();
    e.target.classList.toggle("walk-card--favourited");
  }

  return (
    <Link to={`/walk/${walk.slug}`} className="walk-card flex-group">

      <div className="walk-card_image walks-page_desktop-only">
        <img src={previews[walk.slug]} alt={walk.name + " preview"} loading="lazy" />
      </div>

      <div className="walk-card_text flex-group flex-column">
        <h3 title={walk?.name}>{walk?.name}</h3>
        <p>
          {hills?.map((hill, index) => {
            return (
              <Fragment key={index}>
                {index !== 0 && ", "}
                {hillData?.[hill]?.name}
              </Fragment>
            )
          })}
        </p>
        <p className="walk-card_stats flex-group flex-vertical-center">
          <span className="flex-group flex-vertical-center">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" viewBox="0 0 100 125">
              <circle cx="46" cy="12.6" r="10.1"/>
              <path d="M74.9,41.4l-9.1-3.5l-6.5-8c-2.3-2.8-5.7-4.4-9.3-4.4h-8.4c-3.3,0-6.5,1.4-8.8,3.8L26,36.7c-0.6,0.6-0.9,1.3-1.1,2.1     l-2.5,12.1c-0.5,2.4,1,4.8,3.5,5.3c0.3,0.1,0.6,0.1,0.9,0.1c2.1,0,3.9-1.5,4.4-3.6l2.3-10.8l3-3.2v19.1l-2.2,14.3l-9.8,17.6     c-1.4,2.5-0.5,5.7,2,7.1c0.8,0.5,1.7,0.7,2.5,0.7c1.8,0,3.6-1,4.6-2.7l10.3-18.4c0.3-0.5,0.5-1.1,0.6-1.8l2-12.8l8.6,14.6     l3.3,16.8c0.5,2.5,2.7,4.2,5.1,4.2c0.3,0,0.7,0,1-0.1c2.8-0.6,4.7-3.3,4.1-6.1L65,73.6c-0.1-0.6-0.3-1.1-0.6-1.6l-8.9-15.2V39.5     l4,5c0.5,0.6,1.1,1.1,1.9,1.4l10.2,3.9c2.3,0.9,4.9-0.3,5.8-2.6C78.4,44.8,77.2,42.3,74.9,41.4z"/>
            </svg>
            {walk?.distance}km
          </span>
          •
          <span className="flex-group flex-vertical-center">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
            {walk?.total_elevation}m
          </span>
          •
          <span className="flex-group flex-vertical-center">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {walk?.estimated_time}
          </span>
          •
          <span className="flex-group flex-vertical-center">
            {walk?.wainwrights?.length}
            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" viewBox="0 0 100 125">
              <polygon points="59.811,100 19.623,100 39.717,65.194 59.811,30.391 79.906,65.194 100,100  "/>
              <polygon points="35.658,60.679 29.18,49.457 14.59,74.729 0,100 12.958,100 33.051,65.194  "/>
            </svg>            
          </span>
        </p>
      </div>
    </Link>
  )
}


function FilterSection({ filters, setFilters }) {

  const updateTypes = (e) => {
    const clickedVal = e.target.value;

    const addRemoveType = (prev) => {
      let prevTypes = [...prev];
      if (e.target.checked && !prevTypes.includes(clickedVal)) prevTypes.push(clickedVal);
      else {
        const typeIndex = prevTypes.indexOf(clickedVal);
        if (typeIndex > -1) prevTypes.splice(typeIndex, 1);
      }
      return prevTypes;
    }

    setFilters(prev => ({...prev, types: addRemoveType(prev.types)}))
  }

  return (
    <div className="walks-page--walk-filters text--secondary">
      <h2 className="text--subtext">Filter walks</h2>

      <div>
        <h3 className="text--default">Distance</h3>
        <input type="range" />        
      </div>

      <div>
        <h3 className="text--default">Duration</h3>
        <form className="walks-page--filter-choices">
          {[["0,100", "Any"], ["0,2", "< 2 hours"], ["2,4", "2 - 4 hours"], ["4,6", "4 - 6 hours"], ["6,100", "6+ hours"]].map((val, index) => {
            const [value, text] = val;
            return (
              <label key={index} className="walks-page--duration-filter">
                <input type="radio" value={value}
                      checked={filters.duration.join(",") === value}
                      onChange={() => setFilters(prev => ({...prev, duration: value.split(",")}))} />
                {text}
              </label>
            )
          })}
        </form>
      </div>

      <div>
        <h3 className="text--default">Wainwrights</h3>
        <div className="walks-page--filter-choices">
          <input type="text" /><input type="text" />  
        </div>
      </div>

      <div>
        <h3 className="text--default">Type of walk</h3>
        <div className="walks-page--filter-choices">
          {["horseshoe", "circular", "there-and-back", "point-to-point"].map((val, index) => {
            return (
              <label key={index} className="walks-page--type-filter">
                <input type="checkbox" value={val} onChange={updateTypes} /> {val}
              </label>
            )
          })}
        </div>
      </div>

    </div>
  )
}

