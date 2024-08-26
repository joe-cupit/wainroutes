import "../styles/map.css";

import { useEffect, useState } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import Supercluster from 'supercluster';
const geoViewport = require('@mapbox/geo-viewport');
// import { maptiler } from 'pigeon-maps/providers';

// import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'


export function LakeMap({ showWainwrights=false, showWalkroutes=false }) {

  const [center, setCenter] = useState([54.55, -3.09]);
  const [zoom, setZoom] = useState(11);
  const [minZoom, setMinZoom] = useState();
  const [shownPoints, setShownPoints] = useState([])
  // const maptilerProvider = maptiler(process.env.REACT_APP_MAP_API_KEY, "topo-v2")

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

    const mapBounds = document.getElementById("lake-map").getBoundingClientRect()
    const { center, zoom } = geoViewport.viewport(
      [minLat, minLong, maxLat, maxLong], [mapBounds.width, mapBounds.height], 0, 20, 256, true
    )

    setCenter([center[0]+0.015, center[1]]);
    setZoom(zoom*0.98);
    setMinZoom(zoom*0.85);
  }, [shownPoints])

  // const [wainwrights, setWainwrights] = useState();
  useEffect(() => {
    if (showWainwrights) {
      fetch("/mountains/wainwrights.json")
        .then(response => response.text())
        .then(responseText => {
          // setWainwrights(JSON.parse(responseText));

          let newLatLang = [];
          for (let hill of JSON.parse(responseText)) {
            newLatLang.push({coordinates: [hill.latitude, hill.longitude], book: hill.book});
          }

          setShownPoints(newLatLang);
        });
    }
  }, [showWainwrights]);    

  // const [walkRoutes, setWalkRoutes] = useState(); 
  useEffect(() => {
    if (showWalkroutes) {
      fetch("/walks/walkstarts.json")
        .then(response => response.text())
        .then(responseText => {
          // setWalkRoutes(JSON.parse(responseText));

          let newLatLang = [];
          for (let walk of JSON.parse(responseText)) {
            newLatLang.push([walk.latitude, walk.longitude]);
          }
          setShownPoints(curr => [...curr, ...newLatLang]);
        });
    }
  }, [showWalkroutes]);


  const zoomTo = (coordinates) => {
    onBoundsChanged(coordinates, ((zoom+3>=13) ? 13 : zoom+3), [])
  }

  const renderMarker = (point, key) => {
    const width = 30;

    const clusterItems = (point.properties?.cluster || false) ?
      supercluster.getLeaves(point.id, 4) || [point]
       : [point];

    return (
      <Marker key={key} color="currentColor" width={width} className="wainwright"
              anchor={point.geometry.coordinates}
              onMouseOver={() => {}}
              onClick={() => zoomTo(point.geometry.coordinates)}
      >
        <div className="map--cluster">
          <WainwrightIcon width={width} book={clusterItems[0].properties.book} />

          {clusterItems.slice(1).map((item, index) => {
            return (<WainwrightIcon key={index} width={width} book={item.properties.book} />)
          })}
        </div>

      </Marker>
    )
  }

  const [supercluster, setSupercluster] = useState(null);
  const [markerPositions, setMarkerPositions] =  useState([]);

  useEffect(() => {
    if (!shownPoints || shownPoints?.length === 0) return

    const index = new Supercluster({ radius: 20 });

    index.load(shownPoints?.map(point => ({
      geometry: {
        coordinates: point.coordinates,
        type: "Point"
      },
      properties: {
        book: point.book
      }
    })));

    setSupercluster(index);
  }, [shownPoints])


  const onBoundsChanged = (newcenter, newzoom, newbounds) => {
    if (supercluster !== null && newzoom !== zoom) {
      console.log("clustering")
      let newthing = supercluster?.getClusters([54, -4, 55, -2], newzoom);
      setMarkerPositions(
        newthing.sort((a, b) => b.geometry?.coordinates[0] - a.geometry?.coordinates[0])
      );
    }

    setCenter(newcenter);
    setZoom(newzoom);
  }

  return (<>
    <section id="lake-map" className="lake-map-container">
      <Map
        center={center} zoom={zoom} minZoom={minZoom || 1} zoomSnap={false}
        onBoundsChanged={({ center, zoom, bounds }) => onBoundsChanged(center, zoom, bounds)}
        // provider={maptilerProvider}
        // attributionPrefix={false}
      >
        <ZoomControl style={{zIndex: 11}}/>
        {markerPositions?.map(renderMarker)}
      </Map>
    </section>
  </>)
}


function WainwrightIcon({ width, book }) {
  return (
  <svg width={width} className={`wain-book-${book}`} viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="#151515" strokeWidth={1} >
    <g style={{ pointerEvents: 'auto' }}>
      <path d="M13.0392019,21.7081936 C12.0940626,22.2815258 10.8626021,21.9809256 10.2886866,21.0367943 C6.7619497,15.2353103 5,11.2870891 5,8.99256161 C5,5.13067647 8.13400675,2 12,2 C15.8659932,2 19,5.13067647 19,8.99256161 C19,11.2870898 17.2380492,15.2353128 13.71131,21.0367998 C13.544473,21.3112468 13.3139409,21.5415339 13.0392019,21.7081936 Z M12.0074463,12 C13.666063,12 15.0106376,10.6568542 15.0106376,9 C15.0106376,7.34314575 13.666063,6 12.0074463,6 C10.3488296,6 9.00425503,7.34314575 9.00425503,9 C9.00425503,10.6568542 10.3488296,12 12.0074463,12 Z"/>
    </g>
  </svg>
  )
}
