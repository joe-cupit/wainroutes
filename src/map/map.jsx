import "../styles/map.css";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Map, Marker, GeoJson, ZoomControl, GeoJsonFeature } from "pigeon-maps";
import { useSupercluster } from "./useSupercluster";
import { Link } from "react-router-dom";
const geoViewport = require('@mapbox/geo-viewport');


// main component
export function LakeMap ({ mapMarkers, gpxPoints, ...props }) {

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

    const mapBounds = document.getElementById("lake-map").getBoundingClientRect()
    const { center, zoom } = geoViewport.viewport(
      [minLat, minLong, maxLat, maxLong], [mapBounds.width, mapBounds.height], 0, 20, 256, true, true
    )

    setCenter([center[0]+(mapMarkers ? 0.015 : 0), center[1]]);
    setZoom(zoom*0.98);
    setMinZoom(zoom*0.83);
  }, [mapPoints]);


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

      return (
        <Marker key={key} className="lake-map--marker"
                anchor={point.geometry.coordinates}
                onClick={() => {
                  setCenter(point.geometry.coordinates);
                  if (clusterItems.length > 1) setZoom(supercluster.getClusterExpansionZoom(point.id)+1);
                  else {
                    console.log("show details for", point?.properties?.name);
                    if (zoom < 11.5) setZoom(11.5);
                  }
                }}
        >
          <div className="lake-map--cluster">
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


  return (
    <div id="lake-map" className={props.className ? "lake-map--container "+props.className : "lake-map--container"}>
      <Map className="lake-map"
           center={center} zoom={zoom}
           minZoom={minZoom} zoomSnap={false}
           onBoundsChanged={onBoundsChanged}
           attributionPrefix={false}
           attribution={<Attribution />}
      >
        {markers?.map(renderMarker)}
        {props.children}
        <ZoomControl />
      </Map>
    </div>
  )
}


// secondary components
export function GeoRoute ({ points, ...props }) {

  const data = useMemo(() => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: points
      }
   }), [points])

  return (points && (
    <GeoJson styleCallback={() => ({ className: "lake-map--route" })} {...props}>
      <GeoJsonFeature feature={data} />
    </GeoJson>
  ))
}

function Attribution () {
  return (
    <div className="lake-map--attribution">
      <Link to="https://pigeon-maps.js.org/" target="_blank">Pigeon</Link> | © <Link to="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</Link> contributors
    </div>
  )
}


// icons
function HillIcon({ book }) {
  return (
    <svg className={`lake-map--marker wain-book-${book}`}
         viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
      <g style={{ pointerEvents: "auto" }}>
        <circle cx="12.5" cy="9.5" r="4" fill="rgba(222, 225, 178, .01)" />
        <path d="M13.0392019,21.7081936 C12.0940626,22.2815258 10.8626021,21.9809256 10.2886866,21.0367943 C6.7619497,15.2353103 5,11.2870891 5,8.99256161 C5,5.13067647 8.13400675,2 12,2 C15.8659932,2 19,5.13067647 19,8.99256161 C19,11.2870898 17.2380492,15.2353128 13.71131,21.0367998 C13.544473,21.3112468 13.3139409,21.5415339 13.0392019,21.7081936 Z M12.0074463,12 C13.666063,12 15.0106376,10.6568542 15.0106376,9 C15.0106376,7.34314575 13.666063,6 12.0074463,6 C10.3488296,6 9.00425503,7.34314575 9.00425503,9 C9.00425503,10.6568542 10.3488296,12 12.0074463,12 Z"/>
      </g>
    </svg>
  )
}

function WalkIcon() {
  return (
    <svg className="lake-map--marker walk-marker" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="#151515" strokeWidth={1} >
      <g style={{ pointerEvents: "auto" }}>
        <circle cx="12.5" cy="9.5" r="4" fill="rgba(222, 225, 178, .01)" />
        <path d="M13.0392019,21.7081936 C12.0940626,22.2815258 10.8626021,21.9809256 10.2886866,21.0367943 C6.7619497,15.2353103 5,11.2870891 5,8.99256161 C5,5.13067647 8.13400675,2 12,2 C15.8659932,2 19,5.13067647 19,8.99256161 C19,11.2870898 17.2380492,15.2353128 13.71131,21.0367998 C13.544473,21.3112468 13.3139409,21.5415339 13.0392019,21.7081936 Z M12.0074463,12 C13.666063,12 15.0106376,10.6568542 15.0106376,9 C15.0106376,7.34314575 13.666063,6 12.0074463,6 C10.3488296,6 9.00425503,7.34314575 9.00425503,9 C9.00425503,10.6568542 10.3488296,12 12.0074463,12 Z"/>
      </g>
    </svg>
  )
}
