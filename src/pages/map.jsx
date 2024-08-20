import "../styles/map.css";

import { useEffect, useState } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { maptiler } from 'pigeon-maps/providers';

// import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'


export function LakeMap({ showWainwrights=false, showWalkroutes=false }) {

  const [center, setCenter] = useState([54.55, -3.09]);
  const [zoom, setZoom] = useState(10.65)
  // const maptilerProvider = maptiler(process.env.REACT_APP_MAP_API_KEY, "topo-v2")

  const [wainwrights, setWainwrights] = useState();
  useEffect(() => {
    fetch("./wainwrights.json")
      .then(response => response.text())
      .then(responseText => {
        setWainwrights(JSON.parse(responseText));
      });
  }, []);

  const [walkRoutes, setWalkRoutes] = useState();
  useEffect(() => {
    fetch("./walkstarts.json")
      .then(response => response.text())
      .then(responseText => {
        setWalkRoutes(JSON.parse(responseText));
      });
  }, []);

  // const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
  //   console.log(center, zoom, bounds, initial)
  // }

  return (<>
    <section className="lake-map-container">
      <Map
        // provider={maptilerProvider}
        center={center} zoom={zoom} minZoom={10.5} zoomSnap={false}
        // onBoundsChanged={onBoundsChanged}
        >
        {showWainwrights && wainwrights?.map((hill, index) => {
          return (<Marker className="wainwright" key={index} anchor={[hill.latitude, hill.longitude]} color="#eb873c"/>)
        })}
        {showWalkroutes && walkRoutes?.map((hill, index) => {
          return (<Marker className="walks" key={index} anchor={[hill.latitude, hill.longitude]} color="#3ca0eb"/>)
        })}
        <ZoomControl />
      </Map>
    </section>
  </>)
}