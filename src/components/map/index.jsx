import "./index.css";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Map, Marker, GeoJson, ZoomControl, GeoJsonFeature } from "pigeon-maps";
import { useSupercluster } from "./hooks/useSupercluster";
import { Link } from "react-router-dom";

// import { maptiler } from 'pigeon-maps/providers';
// const maptilerProvider = maptiler(import.meta.env.VITE_MAP_API_KEY, "uk-openzoomstack-outdoor");

// const geoViewport = require('@mapbox/geo-viewport');



// main component
export function LakeMap ({ mapMarkers, gpxPoints, activePoint, ...props }) {

  const [center, setCenter] = useState(props.defaultCenter || [54.55, -3.09]);
  const [zoom, setZoom] = useState(props.defaultZoom || 11);
  const [minZoom, setMinZoom] = useState(3);
  const onBoundsChanged = ({ center, zoom }) => {
    setCenter(center);
    setZoom(zoom);
  }

  const mapPoints = useMemo(() => {
    return [...(mapMarkers ?? []).map(m => m.coordinates), 
            ...(gpxPoints ?? []).map(p => [p[1], p[0]])]
  }, [mapMarkers, gpxPoints]);

  useEffect(() => {
    if (!mapPoints || mapPoints.length === 0
        || !document?.getElementById("lake-map")) return;

    let minLat = 999.0; let maxLat = -999.0;
    let minLong = 999.0; let maxLong = -999.0;
    for (let point of mapPoints) {
      const [lat, long] = point;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (long < minLong) minLong = long;
      if (long > maxLong) maxLong = long;
    }

    // const mapBounds = document.getElementById("lake-map").getBoundingClientRect()
    // const { center, zoom } = geoViewport.viewport(
    //   [minLat, minLong, maxLat, maxLong], [mapBounds.width, mapBounds.height], 0, 20, 256, true, true
    // )

    // setCenter([center[0]+(!gpxPoints ? 0.015 : 0), center[1]]);
    // setZoom(zoom*0.98);
    // setMinZoom(zoom*0.83);

    const mapBounds = document.getElementById("lake-map").getBoundingClientRect();
    let newcenter = [(minLat+maxLat)/2, (minLong+maxLong)/2]
    let newzoom = -Math.max(Math.log((maxLat-minLat)/(mapBounds.height-100))/Math.log(2), Math.log((maxLong-minLong)/(mapBounds.width))/Math.log(2))

    setCenter(newcenter);
    setZoom(newzoom*0.98);
    setMinZoom(newzoom*0.75);

  }, [mapPoints, gpxPoints]);


  const supercluster = useSupercluster(mapMarkers);
  const [markers, setMarkers] = useState(null);
  useEffect(() => {
    if (supercluster === null) return;

    setMarkers(
      supercluster?.getClusters([54, -4, 55, -2], zoom)
        ?.sort((a, b) => b?.geometry?.coordinates?.[0] - a?.geometry?.coordinates?.[0])
    );
  }, [supercluster, zoom])

  const renderMarker = (point, key) => {
    try {
      const clusterItems = (point?.properties?.cluster || false)
        ? supercluster.getLeaves(point.id, Infinity)
        : [point];
      
      var focussed = false;
      if (activePoint) {
        for (let marker of clusterItems) {
          if (activePoint === marker.properties.slug) focussed = true;
        }
      }

      return (
        <Marker key={key} className="lake-map--marker"
                anchor={point.geometry.coordinates}
                onClick={() => {
                  setCenter(point.geometry.coordinates);
                  if (clusterItems.length > 1) setZoom(supercluster.getClusterExpansionZoom(point.id)+1);
                  else {
                    console.log("show details for", point?.properties?.name);
                    if (zoom < 13) setZoom(13);
                  }
                }}
        >
          <div className={"lake-map--cluster" + (focussed ? " focussed-cluster" : "")}>
            {clusterItems.map((item, index) => {
              return item.properties.type === "hill"
                ? <HillIcon key={index} book={item.properties.book} />
                : <WalkIcon key={index} />
            })}
          </div>
        </Marker>
      )

    } catch (e) {
      console.log("cluster error\n", e);
      return <Fragment key={key}></Fragment>
    }
  }

  useEffect(() => {
    document.getElementsByClassName("pigeon-zoom-in")[0].ariaLabel = "Zoom in"
    document.getElementsByClassName("pigeon-zoom-out")[0].ariaLabel = "Zoom out"
  }, [])


  return (
    <div id="lake-map" className={props.className ? "lake-map--container "+props.className : "lake-map--container"} style={{minWidth: "100px", minHeight: "100px"}}>
      <Map className="lake-map"
           center={center} zoom={zoom}
           minZoom={minZoom} zoomSnap={false}
           onBoundsChanged={onBoundsChanged}
           attributionPrefix={false}
           attribution={<Attribution />}
          //  provider={maptilerProvider}
      >
        {props.children}
        {markers?.map(renderMarker)}
        <ZoomControl />
      </Map>
    </div>
  )
}


// secondary components
export function GeoRoute ({ points, activeIndex, ...props }) {

  const data = useMemo(() => ({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: points
    }
  }), [points])

  const activeData = useMemo(() => {
    if (points === null || activeIndex === null) return null
    else return ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: points[activeIndex]
      }
    })
  }, [points, activeIndex])

  return (points && 
    <GeoJson {...props}>
      <GeoJsonFeature feature={data} styleCallback={() => ({ className: "lake-map--route" })} />
      {activeData &&
        <GeoJsonFeature feature={activeData}
          svgAttributes={{ r: "6" }}
          styleCallback={() => ({ className: "lake-map--hovered-point" })}
        />}
    </GeoJson>
  )
}

function Attribution () {
  return (
    <p className="lake-map--attribution">
      <Link to="https://pigeon-maps.js.org/" target="_blank" aria-label="Pigeon Maps">Pigeon</Link> | © <Link to="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</Link> contributors
    </p>
  )
}


// icons
function HillIcon({ book }) {
  return (
    // <svg className={`lake-map--marker wain-book-${book}`}
    //      viewBox="4 1 15.5 22" xmlns="http://www.w3.org/2000/svg">
    //   <g style={{ pointerEvents: "auto" }}>
    //     <circle cx="12.5" cy="9.5" r="4" fill="rgba(222, 225, 178, .01)" />
    //     <path d="M13.0392019,21.7081936 C12.0940626,22.2815258 10.8626021,21.9809256 10.2886866,21.0367943 C6.7619497,15.2353103 5,11.2870891 5,8.99256161 C5,5.13067647 8.13400675,2 12,2 C15.8659932,2 19,5.13067647 19,8.99256161 C19,11.2870898 17.2380492,15.2353128 13.71131,21.0367998 C13.544473,21.3112468 13.3139409,21.5415339 13.0392019,21.7081936 Z M12.0074463,12 C13.666063,12 15.0106376,10.6568542 15.0106376,9 C15.0106376,7.34314575 13.666063,6 12.0074463,6 C10.3488296,6 9.00425503,7.34314575 9.00425503,9 C9.00425503,10.6568542 10.3488296,12 12.0074463,12 Z"/>
    //   </g>
    // </svg>

    // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4 4 4" className={`lake-map--marker wain-book-${book}`}>
    //   <path d="M0 0 2-4 4 0Z" style={{ pointerEvents: "auto", strokeWidth: 0.25 }}/>
    // </svg>

    // <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="undefined">
    //   <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
    // </svg>

    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" // className={`wain-book-${book}`}
    >
      <path d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  )
}

function WalkIcon() {
  return (
    // <svg className="lake-map--marker walk-marker" viewBox="4 1 15.5 22" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="#151515" strokeWidth={1} >
    //   <g style={{ pointerEvents: "auto" }}>
    //     <circle cx="12.5" cy="9.5" r="4" fill="rgba(222, 225, 178, .01)" />
    //     <path d="M13.0392019,21.7081936 C12.0940626,22.2815258 10.8626021,21.9809256 10.2886866,21.0367943 C6.7619497,15.2353103 5,11.2870891 5,8.99256161 C5,5.13067647 8.13400675,2 12,2 C15.8659932,2 19,5.13067647 19,8.99256161 C19,11.2870898 17.2380492,15.2353128 13.71131,21.0367998 C13.544473,21.3112468 13.3139409,21.5415339 13.0392019,21.7081936 Z M12.0074463,12 C13.666063,12 15.0106376,10.6568542 15.0106376,9 C15.0106376,7.34314575 13.666063,6 12.0074463,6 C10.3488296,6 9.00425503,7.34314575 9.00425503,9 C9.00425503,10.6568542 10.3488296,12 12.0074463,12 Z"/>
    //   </g>
    // </svg>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" // className={`wain-book-${book}`}
    >
      <path d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  )
}
