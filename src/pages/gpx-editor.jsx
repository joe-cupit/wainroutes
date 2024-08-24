import "../styles/gpx-editor.css";

import { Map, GeoJson, ZoomControl } from "pigeon-maps";
import { useEffect, useState } from "react";


export function EditorPage() {

  const [GPXPoints, setGPXPoints] = useState(null);
  const [geoJSON, setGeoJSON] = useState(null);

  // open gpx file (to be changed to user upload)
  useEffect(() => {
    // https://stackoverflow.com/a/65486570
    fetch("/gpx/Fairfield_Horseshoe.gpx")
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      // .then(data => console.log(data))
      .then(doc => {
        var points = [];

        const nodes = [...doc.getElementsByTagName("trkpt")];
        nodes.forEach(node => {
          points.push([parseFloat(node.getAttribute("lat")), parseFloat(node.getAttribute("lon"))])
        })

        setGPXPoints(points);
      })
  }, [])

  // update geoJSON based on current gpx points
  useEffect(() => {
    if (GPXPoints === null) return

    let geoCoords = []
    let geoPoints = []
    GPXPoints?.forEach((point, index) => {
      if (index % 100 === 0) {
        geoCoords.push([point[1], point[0]])
        geoPoints.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [point[1], point[0]]
          }
        })
      }
    })

    let tmp = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: geoCoords
          }
        },
        ...geoPoints
      ],
    }
    console.log(tmp)

    setGeoJSON(tmp);
  }, [GPXPoints])

  const geoJsonSample = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-2.9630070, 54.4337000] },
        properties: { prop0: "value0" },
      },
    ],
  };

  return (<>
    <main className="gpx-editor--map-container">
      <Map defaultCenter={[54.45, -3.03]} defaultZoom={10}>
        {geoJSON && <GeoJson
          data={geoJSON}
          styleCallback={(feature, hover) => {
            if (feature.geometry.type === "LineString") {
              return { strokeWidth: "2", stroke: "black" };
            }
            else if (feature.geometry.type === "Point") {
              if (!hover) return { strokeWidth: "2", stroke: "black", r: "3" };
              else return { strokeWidth: "2", stroke: "black", r: "3", fill: "red" };
            }
          }}
        />}

        <ZoomControl />
      </Map>
    </main>
  </>)
}