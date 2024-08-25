import "../styles/gpx-editor.css";

import { Map, GeoJson, ZoomControl } from "pigeon-maps";
import { useEffect, useState } from "react";


export function EditorPage() {

  const [GPXPoints, setGPXPoints] = useState(null);
  const [geoJSON, setGeoJSON] = useState(null);
  const totalPoints = geoJSON?.[1]?.features?.length;

  const [center, setCenter] = useState([54.45, -3.03])
  const [zoom, setZoom] = useState(10)
  const onBoundsChanged = ({ center, zoom }) => {
    setCenter(center);
    setZoom(zoom);
  }

  const [samplingRate, setSamplingRate] = useState(100);

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
          points.push({
            lat: parseFloat(node.getAttribute("lat")),
            lon: parseFloat(node.getAttribute("lon")),
            ele: parseFloat(node.getElementsByTagName("ele")[0].textContent),
            time: new Date(node.getElementsByTagName("time")[0].textContent)
          })
        })

        setGPXPoints(points);
      })
  }, [])

  // update geoJSON based on current gpx points
  useEffect(() => {
    if (GPXPoints === null) return

    let geoCoords = []
    let geoPoints = []

    var validTime = new Date(0);
    GPXPoints?.forEach((point, index) => {
      if (point.time >= validTime) {
        geoCoords.push([point.lon, point.lat])
        geoPoints.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [point.lon, point.lat]
          }
        })

        validTime = new Date(point.time.getTime() + samplingRate*1000);
      }
    })
    const finalPoint = GPXPoints?.[GPXPoints?.length - 1]
    geoCoords.push([finalPoint.lon, finalPoint.lat])
    geoPoints.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [finalPoint.lon, finalPoint.lat]
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
        }
      ]
    }

    let tmp2 = {
      type: "FeatureCollection",
      features: [
        ...geoPoints
      ]
    }

    setGeoJSON([tmp, tmp2]);
  }, [samplingRate, GPXPoints])

  return (<>
    <MapNavbar
      samplingRate={samplingRate} setSamplingRate={setSamplingRate}
      totalPoints={totalPoints} />
    <main className="gpx-editor--main">
      <section className="gpx-editor--map-container">
        <Map defaultCenter={[54.45, -3.03]} defaultZoom={10}
            center={center} zoom={zoom} zoomSnap={false}
            onBoundsChanged={onBoundsChanged} >
          {geoJSON && <GeoJson
            data={geoJSON?.[0]}
            styleCallback={(feature, hover) => {
              return { strokeWidth: "3", stroke: "#eb873c" };
            }}
          />}
          {geoJSON && (zoom >= 15) &&
            <GeoJson
              data={geoJSON?.[1]}
              styleCallback={(feature, hover) => {
                if (!hover) return { strokeWidth: "2", stroke: "#eb873c", r: zoom-11*(18/zoom) };
                else return { strokeWidth: "2", stroke: "#eb873c", r: zoom-11*(18/zoom), fill: "#eb873c" };
              }}
            />
          }

          <ZoomControl style={{ top: "4.75rem", left: "1.125rem" }} />
        </Map>

      </section>
      <section className="gpx-editor--elevation">

      </section>      
    </main>

  </>)
}


function MapNavbar({ samplingRate, setSamplingRate, totalPoints }) {

  const updateSamplingRate = (e) => {
    var newVal = e.target.value;
    if (newVal < 1) newVal = 1;
    if (newVal > 3600) newVal = 3600;

    setSamplingRate(parseFloat(newVal))
  }

  return (
    <nav className="gpx-editor--navbar">
      <span>
        <label htmlFor="sampling">Sampling rate (s between sample): </label>
        <input type="range" name="sampling"
               value={samplingRate} onChange={updateSamplingRate}
               min="1" max="3600" 
        />
        <input type="number" name="sampling"
               value={samplingRate} onChange={updateSamplingRate}
               min="1" max="3600" 
        />
        ({totalPoints}) total gpx points
      </span>
    </nav>
  )
}
