import "../styles/gpx-editor.css";

import { Map, GeoJson, ZoomControl, Draggable } from "pigeon-maps";
import { useEffect, useState, useMemo } from "react";
import haversine from "haversine-distance";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

// import { maptiler } from 'pigeon-maps/providers';
// const maptilerProvider = maptiler(process.env.REACT_APP_MAP_API_KEY, "topo-v2");

const geoViewport = require('@mapbox/geo-viewport');


export function EditorPage() {

  document.title = "GPX Editor | WainRoutes";

  const zoomToFit = (coords) => {
    let minLat = 999.0; let maxLat = -999.0;
    let minLong = 999.0; let maxLong = -999.0;
    for (let point of coords) {
      const [long, lat] = point;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (long < minLong) minLong = long;
      if (long > maxLong) maxLong = long;
    }

    const mapBounds = document.getElementById("gpx-map").getBoundingClientRect();
    let newcenter = [(minLat+maxLat)/2, (minLong+maxLong)/2]
    let newzoom = -Math.max(Math.log((maxLat-minLat)/(mapBounds.height-160))/Math.log(2), Math.log((maxLong-minLong)/mapBounds.width)/Math.log(2))

    setCenter(newcenter);
    setZoom(newzoom);

    // console.log(geoViewport.bounds(newcenter, newzoom, [mapBounds.width, mapBounds.height]))
  }

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const pushToUndoStack = (newItem) => {
    setRedoStack([]);
    setUndoStack(prev => [...prev, newItem]);      
  }
  const popFromUndoStack = () => {
    if (undoStack.length === 0) return;

    let prevStack = [...undoStack];
    let popped = prevStack.pop();
    setUndoStack(prevStack);
    setRedoStack(prev => [...prev, [...fullPoints]])
    setFullPoints(popped);
  }
  const popFromRedoStack = () => {
    if (redoStack.length === 0) return;

    let prevStack = [...redoStack];
    let popped = prevStack.pop();
    setRedoStack(prevStack);
    setUndoStack(prev => [...prev, [...fullPoints]])
    setFullPoints(popped);
  }

  const [gpxFile, setGpxFile] = useState(null);

  const handleUploadFile = (e) => {
    setGpxFile(e.target.files[0]);
  }

  const [fullPoints, setFullPoints] = useState(null);
  const [samplingRate, setSamplingRate] = useState(10);

  const [dist, setDist] = useState(0);
  const [elevation, setElevation] = useState(0);

  const [elevationList, setElevationList] = useState([]);

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

      let dist = 0, elevation = 0;
      let eleList = [];
      let prevP = null, prevE = null;
      const nodes = [...doc.getElementsByTagName("trkpt"), ...doc.getElementsByTagName("rtept")];
      nodes.forEach(node => {
        let point = [parseFloat(node.getAttribute("lon")), parseFloat(node.getAttribute("lat"))];
        let ele = node.getElementsByTagName("ele")[0]?.textContent;
        if (prevP !== null) {
          dist += haversine(point, prevP);
          if (ele > prevE) elevation += (ele - prevE);

          eleList.push({dist: parseFloat(dist), ele: parseFloat(ele)});
        }
        prevP = point;
        prevE = ele;

        points.push({
          lat: parseFloat(node.getAttribute("lat")),
          lon: parseFloat(node.getAttribute("lon")),
          ele: parseFloat(node.getElementsByTagName("ele")[0]?.textContent),
          time: Date.parse(node.getElementsByTagName("time")[0]?.textContent)
        })
      })


      setElevationList(eleList);

      setDist(dist);
      setElevation(elevation)

      if (isNaN(points[0].time)) {
        setFullPoints(points.map(p => [p.lon, p.lat]));
      } else {
        let geoCoords = [];
        var validTime = new Date(0);
        points?.forEach(point => {
          if (point.time >= validTime) {
            geoCoords.push([point.lon, point.lat])
            validTime = new Date(point.time + samplingRate*1000);
          }
        })
        const finalPoint = points?.[points?.length - 1]
        geoCoords.push([finalPoint.lon, finalPoint.lat])

        setFullPoints(geoCoords);
        zoomToFit(geoCoords);
      }
    }

    reader.readAsText(gpxFile);
  }, [gpxFile, samplingRate])

  const [center, setCenter] = useState([54.45, -3.03]);
  const [zoom, setZoom] = useState(10);
  const [bounds, setBounds] = useState({ne: [55, 0], sw: [50, -4]});
  const onBoundsChanged = ({ center, zoom, bounds }) => {
    setCenter(center);
    setZoom(zoom);
    setBounds(bounds);
  }
  const gpxPointWidth = useMemo(() => 2*zoom-24, [zoom])

  // const [geoCoords, setGeoCoords] = useState(null);
  const totalPoints = fullPoints?.length;

  const geoLine = useMemo(() => (
    fullPoints
    ? {
      type: "FeatureCollection",
      features: [{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: fullPoints
          }
        }]
      }
    : null
  ), [fullPoints]);

  const geoPoints = useMemo(() => {
    const inBounds = (point) => {
      let coords = point[1];
      const maxBound = bounds.ne;
      const minBound = bounds.sw;
      
      if (coords[1] > maxBound[1] || coords[1] < minBound[1]) return false;
      if (coords[0] > maxBound[0] || coords[0] < minBound[0]) return false;
      return true;
    }

    return fullPoints?.map((point, index) => [index, [point[1], point[0]]])?.filter(inBounds);
  }, [fullPoints, bounds])

  const [editMode, setEditMode] = useState("default");

  const moveGeoPoint = (index, anchor) => {
    if (editMode === "delete") return;

    let newGeoCoords = [...fullPoints];
    newGeoCoords[index] = [anchor[1], anchor[0]];

    setFullPoints(newGeoCoords);
    pushToUndoStack([...fullPoints]);
  }

  const delGeoPoint = (index) => {
    let newGeoCoords = [...fullPoints];
    newGeoCoords.splice(index, 1);

    setFullPoints(newGeoCoords);
    pushToUndoStack([...fullPoints]);
  }

  const handleDownloadFile = () => {
    let gpxText = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
    gpxText += "\n<gpx version=\"1.1\" creator=\"wainroutes.co.uk\" xmlns=\"http://www.topografix.com/GPX/1/1\">";
    // add metadata

    gpxText += "\n  <rte>";
    for (let p of fullPoints) {
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
      setEditMode={setEditMode}
      undoStack={undoStack} redoStack={redoStack}
      popFromUndoStack={popFromUndoStack}
      popFromRedoStack={popFromRedoStack}
    />

    <div className="gpx-editor--gpx-info font--default font--urbanist">
      Distance: {(dist/1000).toFixed(1)}km, Elevation: {elevation.toFixed(0)}m
    </div>

    <main className="gpx-editor--main">
      <section id="gpx-map" className={(editMode === "delete") ? "delete-mode gpx-editor--map-container" : "gpx-editor--map-container"}>
        <Map defaultCenter={[54.45, -3.03]} defaultZoom={10}
            center={center} zoom={zoom} zoomSnap={false} // maxZoom={20}
            onBoundsChanged={onBoundsChanged} animateMaxScreens={1}
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
                  pointer-events={null}
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
        <LineChart width={1000} height={200} data={elevationList}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="dist" label="Distance" unit="m" interval={500} />
          <YAxis domain={[0, 1000]} label="Elevation" unit="m" />
          <Line type="monotone" dataKey="ele" stroke="#82ca9d" strokeWidth={4} dot={false} />
        </LineChart>
      </section>
    </main>

  </>)
}


function MapNavbar({ handleUploadFile, handleDownloadFile, setEditMode, undoStack, popFromUndoStack, redoStack, popFromRedoStack }) {

  // const updateSamplingRate = (e) => {
  //   var newVal = e.target.value;
  //   if (newVal < 1) newVal = 1;
  //   if (newVal > 3600) newVal = 3600;

  //   setSamplingRate(parseFloat(newVal))
  // }

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
        <button className="gpx-editor--navbar-button" title="Move points" onClick={() => {setEditMode("default")}}>
          <svg style={{transform: "rotate(45deg)"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </button>
        <button className="gpx-editor--navbar-button" title="Add points" onClick={() => {setEditMode("add")}}>
          <svg style={{transform: "rotate(45deg)"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <button className="gpx-editor--navbar-button" title="Remove points" onClick={() => {setEditMode("delete")}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <button className="gpx-editor--navbar-button" title="Trim points">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664" />
          </svg>
        </button>
        <button className="gpx-editor--navbar-button" title="Reverse route direction" onClick={(e) => {e.target.classList.toggle("flipped")}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </button>
      </div>

      <div className="gpx-editor--navbar-section">
        <button className="gpx-editor--navbar-button" title="Undo" onClick={popFromUndoStack} disabled={undoStack.length === 0}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"/>
          </svg>
        </button>
        <button className="gpx-editor--navbar-button" title="Redo" onClick={popFromRedoStack} disabled={redoStack.length === 0}>
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
