import "../styles/gpx-editor.css";

import { Map, GeoJson, ZoomControl, Draggable, GeoJsonFeature } from "pigeon-maps";
import { useEffect, useState, useMemo } from "react";

import { maptiler } from 'pigeon-maps/providers';
const maptilerProvider = maptiler(process.env.REACT_APP_MAP_API_KEY, "topo-v2");


export function EditorPage() {

  document.title = "GPX Editor | WainRoutes";

  const [gpxFile, setGpxFile] = useState(null);

  const handleUploadFile = (e) => {
    console.log("here")
    setGpxFile(e.target.files[0]);
  }

  const [fullPoints, setFullPoints] = useState(null);
  const [samplingRate, setSamplingRate] = useState(10);

  // open gpx file
  useEffect(() => {
    if (gpxFile === null || gpxFile === undefined) return;
    if (!gpxFile.name.endsWith(".gpx")) {
      alert("File uploaded is not a valid GPX file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function() {
      const doc = new window.DOMParser().parseFromString(reader.result, "text/xml");

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
    }

    reader.readAsText(gpxFile);
  }, [gpxFile])

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
  const gpxPointWidth = useMemo(() => 2*zoom-24, [zoom])

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

  const [editMode, setEditMode] = useState("default");

  const moveGeoPoint = (index, anchor) => {
    let newGeoCoords = [...geoCoords];
    newGeoCoords[index] = [anchor[1], anchor[0]];

    setGeoCoords(newGeoCoords);
  }

  const delGeoPoint = (index) => {
    let newGeoCoords = [...geoCoords];
    newGeoCoords.splice(index, 1);

    setGeoCoords(newGeoCoords);
  }

  const handleDownloadFile = () => {
    let gpxText = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
    gpxText += "\n<gpx version=\"1.1\" creator=\"wainroutes.co.uk\" xmlns=\"http://www.topografix.com/GPX/1/1\">";
    // add metadata

    gpxText += "\n  <rte>";
    for (let p of geoCoords) {
      gpxText += `\n    <rtept lat="${p[1]}" lon="${p[0]}" />`;
    }
    gpxText += "\n  </rte>";
    gpxText += "\n</gpx>";

    const url = window.URL.createObjectURL(new Blob([gpxText], {type: "text/xml"}));
    let a = document.createElement("a");
    a.href = url;
    a.download = "wainroute.gpx"
    a.click();
  }

  return (<>
    <MapNavbar
      samplingRate={samplingRate}
      setSamplingRate={setSamplingRate}
      totalPoints={totalPoints}
      handleUploadFile={handleUploadFile}
      handleDownloadFile={handleDownloadFile}
    />

    <main className="gpx-editor--main">
      <section className={(editMode === "delete") ? "delete-mode gpx-editor--map-container" : "gpx-editor--map-container"}>
        <Map defaultCenter={[54.45, -3.03]} defaultZoom={10}
            center={center} zoom={zoom} zoomSnap={false} // maxZoom={20}
            onBoundsChanged={onBoundsChanged}
            className={(editMode === "delete") && "delete-mode"}
            // provider={maptilerProvider}
        >
          {geoLine && <GeoJson
            data={geoLine}
            styleCallback={() => {
              return { className: "gpx-editor--line" };
            }}
          />}
          {geoPoints && (zoom >= 15.5) &&
            geoPoints?.map(point => {
              return (
                <Draggable
                  key={point[0]}
                  anchor={point[1]}
                  onDragEnd={(anchor) => moveGeoPoint(point[0], anchor)}
                  style={(editMode === "delete") && {cursor: "pointer"}}
                >
                  <div className="gpx-editor--draggable" style={{width: gpxPointWidth}} onClick={() => {if (editMode === "delete") delGeoPoint(point[0])}} />
                </Draggable>
              )
            })
          }

          <ZoomControl style={{ top: "1.75rem", left: "1.125rem", transform: "scale(1.25)", filter: "drop-shadow(2px 2px 3px rgba(5, 5, 5, 0.25))" }} />
        </Map>

      </section>
      <section className="gpx-editor--elevation">

      </section>      
    </main>

  </>)
}


function MapNavbar({ samplingRate, setSamplingRate, totalPoints, handleUploadFile, handleDownloadFile }) {

  const updateSamplingRate = (e) => {
    var newVal = e.target.value;
    if (newVal < 1) newVal = 1;
    if (newVal > 3600) newVal = 3600;

    setSamplingRate(parseFloat(newVal))
  }

  return (
    <nav className="gpx-editor--navbar text--">
      <div className="gpx-editor--navbar-section">
        <input type="file" id="gpx-input" onChange={handleUploadFile} />
        <button className="gpx-editor--navbar-button" title="Upload a GPX file" onClick={() => {document.getElementById("gpx-input").click()}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
          </svg>
        </button>
      </div>

      <div className="gpx-editor--navbar-section">
        <button className="gpx-editor--navbar-button" title="Add points">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
        <button className="gpx-editor--navbar-button" title="Remove points">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
        <button className="gpx-editor--navbar-button" title="Reverse route direction">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </button>
      </div>

      <div className="gpx-editor--navbar-section">
        <button className="gpx-editor--navbar-button" title="Undo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"/>
          </svg>
        </button>
        <button className="gpx-editor--navbar-button" title="Redo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 9H8a5 5 0 0 0 0 10h9m4-10-4-4m4 4-4 4"/>
          </svg>
        </button>
      </div>

      <div className="gpx-editor--navbar-section">
        <button className="gpx-editor--navbar-button" title="Download route as GPX file" onClick={handleDownloadFile}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
