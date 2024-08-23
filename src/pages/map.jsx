import "../styles/map.css";

import { useEffect, useState } from "react";
import { Map, Marker, ZoomControl } from "pigeon-maps";
// import { maptiler } from 'pigeon-maps/providers';

// import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'


export function LakeMap({ showWainwrights=false, showWalkroutes=false }) {

  const [center] = useState([54.55, -3.09]);
  const [zoom] = useState(10.65)
  // const maptilerProvider = maptiler(process.env.REACT_APP_MAP_API_KEY, "topo-v2")

  const [wainwrights, setWainwrights] = useState();
  useEffect(() => {
    if (showWainwrights) {
      fetch("/mountains/wainwrights.json")
        .then(response => response.text())
        .then(responseText => {
          setWainwrights(JSON.parse(responseText));
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
        });
    }
  }, [showWalkroutes]);


  // const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
  //   console.log(center, zoom, bounds, initial)
  // }

  return (<>
    <section className="lake-map-container">
      <Map
        // provider={maptilerProvider}
        center={center} zoom={zoom} zoomSnap={false}
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
      <div className="lake-map--overlay"></div>
    </section>
  </>)
}