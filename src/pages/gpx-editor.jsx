import "../styles/gpx-editor.css";

import { Map, GeoJson, ZoomControl, Draggable, GeoJsonFeature } from "pigeon-maps";
import { useEffect, useState, useMemo } from "react";


export function EditorPage() {

  document.title = "GPX Editor | WainRoutes";

  const [fullPoints, setFullPoints] = useState(null);
  const [samplingRate, setSamplingRate] = useState(10);

  // open gpx file (to be changed to user upload)
  useEffect(() => {
    // https://stackoverflow.com/a/65486570
    fetch("/tmp/the-fairfield-horseshoe.gpx")
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

        setFullPoints(points);
      })
  }, [])

  // update geoJSON based on current gpx points
  useEffect(() => {
    if (fullPoints === null) return;

    let geoCoords = [];

    var validTime = new Date(0);
    fullPoints?.forEach(point => {
      if (point.time >= validTime) {
        geoCoords.push([point.lon, point.lat])
        validTime = new Date(point.time.getTime() + samplingRate*1000);
      }
    })
    const finalPoint = fullPoints?.[fullPoints?.length - 1]
    geoCoords.push([finalPoint.lon, finalPoint.lat])

    setGeoCoords(geoCoords);
  }, [samplingRate, fullPoints])

  const [center, setCenter] = useState([54.45, -3.03]);
  const [zoom, setZoom] = useState(10);
  const [bounds, setBounds] = useState({ne: [55, 0], sw: [50, -4]});
  const onBoundsChanged = ({ center, zoom, bounds }) => {
    setCenter(center);
    setZoom(zoom);
    setBounds(bounds);
  }

  const [geoCoords, setGeoCoords] = useState(null);
  const totalPoints = geoCoords?.length;

  const geoLine = useMemo(() => (
    geoCoords
    ? {
      type: "FeatureCollection",
      features: [{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: geoCoords
          }
        }]
      }
    : null
  ), [geoCoords]);

  const geoPoints = useMemo(() => {
    const inBounds = (point) => {
      let coords = point[1];
      const maxBound = bounds.ne;
      const minBound = bounds.sw;
      
      if (coords[1] > maxBound[1] || coords[1] < minBound[1]) return false;
      if (coords[0] > maxBound[0] || coords[0] < minBound[0]) return false;
      return true;
    }

    return geoCoords?.map((point, index) => [index, [point[1], point[0]]])?.filter(inBounds);
  }, [geoCoords, bounds])

  const moveGeoPoint = (index, anchor) => {
    let newGeoCoords = [...geoCoords];

    newGeoCoords[index] = [anchor[1], anchor[0]];

    setGeoCoords(newGeoCoords);
  }

  return (<>
    <MapNavbar
      samplingRate={samplingRate}
      setSamplingRate={setSamplingRate}
      totalPoints={totalPoints}
    />
    
    <main className="gpx-editor--main">
      <section className="gpx-editor--map-container">
        <Map defaultCenter={[54.45, -3.03]} defaultZoom={10}
            center={center} zoom={zoom} zoomSnap={false}
            onBoundsChanged={onBoundsChanged} >
          {geoLine && <GeoJson
            data={geoLine}
            styleCallback={() => {
              return { strokeWidth: "3", stroke: "#eb873c" };
            }}
          />}
          {geoPoints && (zoom >= 15.5) &&
            geoPoints?.map(point => {
              return (
                <Draggable
                  key={point[0]}
                  className="gpx-editor--draggable"
                  style={{width: zoom-13*(12/zoom)}}
                  anchor={point[1]}
                  onDragEnd={(anchor) => moveGeoPoint(point[0], anchor)}
                />
              )
            })
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
