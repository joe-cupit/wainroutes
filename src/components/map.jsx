import "../styles/map.css";

import { useEffect, useState } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import Supercluster from 'supercluster';
import { hasPointerEvents } from "@testing-library/user-event/dist/utils";
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
      const [lat, long] = point;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (long < minLong) minLong = long;
      if (long > maxLong) maxLong = long;
    }

    console.log([minLat, minLong, maxLat, maxLong])

    const mapBounds = document.getElementById("lake-map").getBoundingClientRect()
    const { center, zoom } = geoViewport.viewport(
      [minLat, minLong, maxLat, maxLong], [mapBounds.width, mapBounds.height], 0, 20, 256, true
    )

    setCenter([center[0]+0.015, center[1]]);
    setZoom(zoom*0.98);
    setMinZoom(zoom*0.85);
  }, [shownPoints])

  const [wainwrights, setWainwrights] = useState();
  useEffect(() => {
    if (showWainwrights) {
      fetch("/mountains/wainwrights.json")
        .then(response => response.text())
        .then(responseText => {
          setWainwrights(JSON.parse(responseText));

          let newLatLang = [];
          for (let hill of JSON.parse(responseText)) {
            newLatLang.push([hill.latitude, hill.longitude]);
          }
          setShownPoints(curr => [...curr, ...newLatLang]);
        });
    }
  }, [showWainwrights]);    

  const [walkRoutes, setWalkRoutes] = useState();
  useEffect(() => {
    if (showWalkroutes) {
      fetch("/walks/walkstarts.json")
        .then(response => response.text())
        .then(responseText => {
          setWalkRoutes(JSON.parse(responseText));

          let newLatLang = [];
          for (let walk of JSON.parse(responseText)) {
            newLatLang.push([walk.latitude, walk.longitude]);
          }
          setShownPoints(curr => [...curr, ...newLatLang]);
        });
    }
  }, [showWalkroutes]);


  const renderMarker = (point, index) => {
    return (
      <Marker key={index} className="wainwright" anchor={point.geometry.coordinates} color="#eb873c"/>
    )
  }

  const [supercluster, setSupercluster] = useState(null);
  const [markerPositions, setMarkerPositions] =  useState([]);
  
  useEffect(() => {
    if (!shownPoints || shownPoints?.length === 0) return

    const index = new Supercluster({ radius: 20 });

    index.load(shownPoints?.map(point => ({
      geometry: {
        coordinates: point,
        type: "Point"
      }
    })));

    setSupercluster(index);
  }, [shownPoints])


  const onBoundsChanged = ({ center, zoom, bounds }) => {
    setCenter(center);
    setZoom(zoom);
    if (supercluster != null) {
      // const [n, e] = bounds.ne;
      // const [s, w] = bounds.sw;
      // const clusterBounds = [s, w, n, e]
      let newthing = supercluster?.getClusters([54, -4, 55, -2], zoom);
      setMarkerPositions(newthing);
    }
  }

  return (<>
    <section id="lake-map" className="lake-map-container">
      <Map
        center={center} zoom={zoom} minZoom={minZoom || 1} zoomSnap={false}
        onBoundsChanged={onBoundsChanged}
        // provider={maptilerProvider}
        // attributionPrefix={false}
      >
        {markerPositions?.map(renderMarker)}
        <ZoomControl />
      </Map>
      <div className="lake-map--overlay"></div>
    </section>
  </>)
}