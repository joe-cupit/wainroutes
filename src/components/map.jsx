import "../styles/map.css";

import { useEffect, useMemo, useState } from "react";
import Supercluster from 'supercluster';
import { Map, Marker, ZoomControl } from "pigeon-maps";
// import { maptiler } from 'pigeon-maps/providers';
// const maptilerProvider = maptiler(process.env.REACT_APP_MAP_API_KEY, "topo-v2")

const geoViewport = require('@mapbox/geo-viewport');


export function LakeMap({ showWainwrights=false, showWalkroutes=false }) {

  const [center, setCenter] = useState([54.55, -3.09]);
  const [zoom, setZoom] = useState(11);
  const [minZoom, setMinZoom] = useState(null);
  const [bounds, setBounds] = useState(null);

  const [hillPoints, setHillPoints] = useState([]);
  const [walkPoints, setWalkPoints] = useState([]);
  const shownPoints = useMemo(() => [...walkPoints, ...hillPoints], [walkPoints, hillPoints]);

  const [supercluster, setSupercluster] = useState(null);
  const [markerPositions, setMarkerPositions] =  useState([]);

  useEffect(() => {
    if (showWainwrights) {
      fetch("/mountains/wainwrights.json")
        .then(response => response.text())
        .then(responseText => {
          let newLatLang = [];
          const hillData = JSON.parse(responseText)
          for (let hillSlug of Object.keys(hillData)) {
            const hill = hillData[hillSlug];
            newLatLang.push({coordinates: [hill.latitude, hill.longitude], properties: {type: "hill", slug: hillSlug, book: hill.book}});
          }
          setHillPoints(newLatLang);
        });
    }
    else setHillPoints([]);
  }, [showWainwrights]);    

  useEffect(() => {
    if (showWalkroutes) {
      fetch("/walks/walkstarts.json")
        .then(response => response.text())
        .then(responseText => {
          let newLatLang = [];
          for (let walk of JSON.parse(responseText)) {
            newLatLang.push({coordinates: [walk.latitude, walk.longitude], properties: {type: "walk"}});
          }
          setWalkPoints(newLatLang);
        });
    }
    else setWalkPoints([]);
  }, [showWalkroutes]);


  useEffect(() => {
    if (shownPoints.length === 0) return;

    let minLat = 999.0; let maxLat = -999.0;
    let minLong = 999.0; let maxLong = -999.0;
    for (let point of shownPoints) {
      const [lat, long] = point.coordinates;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (long < minLong) minLong = long;
      if (long > maxLong) maxLong = long;
    }

    setBounds([minLat, minLong, maxLat, maxLong])

  }, [shownPoints])

  useEffect(() => {
    if (bounds === null) return;

    const mapBounds = document.getElementById("lake-map").getBoundingClientRect()
    const { center, zoom } = geoViewport.viewport(
      bounds, [mapBounds.width, mapBounds.height], 0, 20, 256, true
    )

    setCenter([center[0]+0.015, center[1]]);
    setZoom(zoom*0.98);
    setMinZoom(zoom*0.85);
  }, [bounds])


  useEffect(() => {
    if (!shownPoints || shownPoints?.length === 0) return

    const index = new Supercluster({ radius: 20 });

    index.load(shownPoints?.map(point => ({
      geometry: {
        coordinates: point.coordinates,
        type: "Point"
      },
      properties: point.properties
    })));

    setSupercluster(index);
  }, [shownPoints])


  useEffect(() => {
    if (supercluster !== null) {
      setMarkerPositions(
        supercluster?.getClusters([54, -4, 55, -2], zoom)
          .sort((a, b) => b.geometry?.coordinates[0] - a.geometry?.coordinates[0])
      );
    }
  }, [zoom, supercluster])

  const zoomTo = (coordinates, cluster=false) => {
    setCenter(cluster ? coordinates : [coordinates[0]+0.002, coordinates[1]]);
    setZoom(cluster ? (zoom*1.2>14 ? 14 : zoom*1.2) : 15);
  }

  const onBoundsChanged = ({ center, zoom }) => {
    setCenter(center);
    setZoom(zoom);
  }

  const renderMarker = (point, key) => {
    const width = 30;
    const clusterItems = (point.properties?.cluster || false) ?
      supercluster.getLeaves(point.id, Infinity) : [point];

    return (
      <Marker key={key} className="lake-map--marker" width={width}
              color="currentColor" anchor={point.geometry.coordinates}
              onMouseOver={() => {}}
              onClick={() => zoomTo(point.geometry.coordinates, (clusterItems.length > 1))}
      >
        <div className="lake-map--cluster">
          {clusterItems.map((item, index) => {
            if (item.properties.type === "hill")
              return (<HillIcon key={index} width={width} book={item.properties.book} />)
            else
              return (<WalkIcon key={index} width={width} />)
          })}
        </div>
      </Marker>
    )
  }

  return (<>
    <section id="lake-map" className="lake-map--container">
      <Map
        center={center} zoom={zoom} minZoom={minZoom || 1} zoomSnap={false}
        onBoundsChanged={onBoundsChanged} // attributionPrefix={false}
        // provider={maptilerProvider}
      >
        <ZoomControl style={{zIndex: 11}}/>
        {markerPositions?.map(renderMarker)}
      </Map>
    </section>
  </>)
}


function HillIcon({ width, book }) {
  return (
    <svg width={width} className={`wain-book-${book}`}
     viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="#151515" strokeWidth={1} >
      <g style={{ pointerEvents: "auto" }}>
        <circle cx="12.5" cy="9.5" r="4" fill="rgba(222, 225, 178, .01)" />
        <path d="M13.0392019,21.7081936 C12.0940626,22.2815258 10.8626021,21.9809256 10.2886866,21.0367943 C6.7619497,15.2353103 5,11.2870891 5,8.99256161 C5,5.13067647 8.13400675,2 12,2 C15.8659932,2 19,5.13067647 19,8.99256161 C19,11.2870898 17.2380492,15.2353128 13.71131,21.0367998 C13.544473,21.3112468 13.3139409,21.5415339 13.0392019,21.7081936 Z M12.0074463,12 C13.666063,12 15.0106376,10.6568542 15.0106376,9 C15.0106376,7.34314575 13.666063,6 12.0074463,6 C10.3488296,6 9.00425503,7.34314575 9.00425503,9 C9.00425503,10.6568542 10.3488296,12 12.0074463,12 Z"/>
      </g>
    </svg>
  )
}

function WalkIcon({ width }) {
  return (
    <svg width={width} className="walk-marker" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="#151515" strokeWidth={1} >
      <g style={{ pointerEvents: "auto" }}>
        <circle cx="12.5" cy="9.5" r="4" fill="rgba(222, 225, 178, .01)" />
        <path d="M13.0392019,21.7081936 C12.0940626,22.2815258 10.8626021,21.9809256 10.2886866,21.0367943 C6.7619497,15.2353103 5,11.2870891 5,8.99256161 C5,5.13067647 8.13400675,2 12,2 C15.8659932,2 19,5.13067647 19,8.99256161 C19,11.2870898 17.2380492,15.2353128 13.71131,21.0367998 C13.544473,21.3112468 13.3139409,21.5415339 13.0392019,21.7081936 Z M12.0074463,12 C13.666063,12 15.0106376,10.6568542 15.0106376,9 C15.0106376,7.34314575 13.666063,6 12.0074463,6 C10.3488296,6 9.00425503,7.34314575 9.00425503,9 C9.00425503,10.6568542 10.3488296,12 12.0074463,12 Z"/>
      </g>
    </svg>
  )
}
