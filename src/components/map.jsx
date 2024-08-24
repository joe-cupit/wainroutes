import "../styles/map.css";

import { useEffect, useState } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
const geoViewport = require('@mapbox/geo-viewport');
// import { maptiler } from 'pigeon-maps/providers';

// import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'


export function LakeMap({ showWainwrights=false, showWalkroutes=false }) {

  const [center, setCenter] = useState([54.55, -3.09]);
  const [zoom, setZoom] = useState(10.65);
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

    const mapBounds = document.getElementById("lake-map").getBoundingClientRect()
    console.log(mapBounds);
    const { center, zoom } = geoViewport.viewport([minLat, minLong, maxLat, maxLong], [mapBounds.width, mapBounds.height])

    setCenter(center);
    setZoom(zoom*1.04);
    setMinZoom(zoom);
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

  return (<>
    <section id="lake-map" className="lake-map-container">
      <Map
        // provider={maptilerProvider}
        center={center} zoom={zoom} minZoom={minZoom || 1} zoomSnap={false}
      >
        {showWainwrights && wainwrights?.map((hill, index) => {
          return (<Marker className="wainwright" key={index} anchor={[hill.latitude, hill.longitude]} color="#eb873c"/>)
        })}
        {showWalkroutes && walkRoutes?.map((hill, index) => {
          return (<Marker className="walks" key={index} anchor={[hill.latitude, hill.longitude]} color="#3ca0eb"/>)
        })}
        <ZoomControl />
      </Map>
      <div className="lake-map--overlay"></div>
    </section>
  </>)
}