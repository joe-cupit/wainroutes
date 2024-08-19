import { useEffect, useState } from "react";
import "../styles/map.css";

import { Map, Marker } from "pigeon-maps";


export function LakeMap() {

  const [center, setCenter] = useState([54.49, -3.05]);

  const [wainwrights, setWainwrights] = useState();
  useEffect(() => {
    fetch("./wainwrights.json")
      .then(response => response.text())
      .then(responseText => {
        setWainwrights(JSON.parse(responseText));
        console.log(JSON.parse(responseText));
      });
  }, []);

  return (
    <section className="lake-map-container">
      <Map defaultCenter={center} defaultZoom={10}>
        {wainwrights?.map((hill, index) => {
          return (<Marker key={index} anchor={[hill.latitude, hill.longitude]} color="red"/>)
        })}
      </Map>
    </section>
  )
}