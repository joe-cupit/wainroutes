import "./index.css";

import { useEffect, useState, useMemo } from "react";
import { Map, GeoJson, ZoomControl, Draggable } from "pigeon-maps";

import useUndoStack from "./hooks/useUndoStack";
import useOpenGpx from "./hooks/useOpenGpx";

import haversine from "./utils/haversine";
import zoomToFit from "./utils/zoomToFit";
import buildXML from "./utils/buildXML";

import MapNavbar from "./components/MapNavbar";

// import { maptiler } from 'pigeon-maps/providers';
// const maptilerProvider = maptiler(process.env.REACT_APP_MAP_API_KEY, "topo-v2");


export default function EditorApp() {

  document.title = "GPX Editor | WainRoutes";

  // map states
  const [center, setCenter] = useState([54.45, -3.03]);
  const [zoom, setZoom] = useState(10);
  const [bounds, setBounds] = useState({ne: [55, 0], sw: [50, -4]});
  const onBoundsChanged = ({ center, zoom, bounds }) => {
    setCenter(center);
    setZoom(zoom);
    setBounds(bounds);
  }
  const gpxPointWidth = useMemo(() => 2*zoom-24, [zoom]);

  // gpx file states
  const [gpxFile, setGpxFile] = useState(null);
  const gpxPoints = useOpenGpx(gpxFile);

  useEffect(() => {
    if (gpxPoints == null) return;
    let geoPoints = [];

    let dist = 0, elevation = 0;
    let prevP = null, prevE = null;
    for (let node of gpxPoints) {
      let point = node.coordinates;
      let ele = node.elevation;
      if (prevP !== null) {
        if (haversine(point, prevP) < 15) {
          continue;
        }
        if (haversine(point, prevP) > 25) {
          prevP = point;
          continue;
        }
        dist += haversine(point, prevP);
        if (ele > prevE) elevation += (ele - prevE);
      }

      geoPoints.push(point)
      prevP = point;
      prevE = ele;
    }

    setDistance(dist);
    setElevation(elevation);
    setFullPoints(geoPoints);
    undoStack.reset();

    let [newcenter, newzoom] = zoomToFit(geoPoints);
    setCenter(newcenter);
    setZoom(newzoom);

  }, [gpxPoints]);


  // gpx point states
  const [fullPoints, setFullPoints] = useState(null);

  const geoJsonLine = useMemo(() => (fullPoints ? {type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "LineString", coordinates: fullPoints}}]} : null), [fullPoints]);
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


  // calculated states
  const [distance, setDistance] = useState(0);
  const [elevation, setElevation] = useState(0);

  // user-controlled options
  const [editMode, setEditMode] = useState("default");
  const [showGeoPoints, setShowGeoPoints] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  const undoStack = useUndoStack();

  // gpx point editing functions
  const reverseGpxDirection = () => {
    if (fullPoints === null) return;

    undoStack.push([...fullPoints]);
    setFullPoints([...fullPoints].reverse());
  }
  const moveGeoPoint = (index, anchor) => {
    if (editMode === "delete") return;

    let newGeoCoords = [...fullPoints];
    newGeoCoords[index] = [anchor[1], anchor[0]];

    undoStack.push([...fullPoints]);
    setFullPoints(newGeoCoords);
  }
  const delGeoPoint = (index) => {
    let newGeoCoords = [...fullPoints];
    newGeoCoords.splice(index, 1);

    undoStack.push([...fullPoints]);
    setFullPoints(newGeoCoords);
  }

  // gpx file upload and download functions
  const handleUploadFile = (e) => {
    setGpxFile(e.target.files[0]);
  }
  const handleDownloadFile = () => {
    let gpxText = buildXML(fullPoints);

    const url = window.URL.createObjectURL(new Blob([gpxText], {type: "text/xml"}));
    let a = document.createElement("a");
    a.href = url;
    a.download = "wainroute.gpx"
    a.click();
  }


  return (<>
    <input type="file" id="gpx-input" onChange={handleUploadFile} style={{display: "none"}} />
    <button id="gpx-download" onClick={handleDownloadFile} style={{display: "none"}} />
    <MapNavbar
      fullPoints={fullPoints} setFullPoints={setFullPoints}
      undoStack={undoStack}
      reverseGpxDirection={reverseGpxDirection}
      editMode={editMode} setEditMode={setEditMode}
      showConfig={showConfig} setShowConfig={setShowConfig}
    />

    <div className="gpx-editor--gpx-config-div" style={!showConfig ? {display: "none"} : {}}>
      <h3 className="text--smallheading font--urbanist">GPX Config</h3>
      <label>GPX title: <input /></label>

      Min point distance
      <input type="range" />
      Max point distance
      <input type="range" />
      <span className="text--secondary" style={{color: "var(--error)"}}>Warning: Current changes will be reverted.</span>
      <button>Apply</button>
    </div>

    <div className="gpx-editor--gpx-info font--default font--urbanist">
      Distance: {(distance/1000).toFixed(1)}km, Elevation: {elevation.toFixed(0)}m
      <button onClick={() => setShowGeoPoints(prev => !prev)}>show/hide points</button>
    </div>

    <main className="gpx-editor--main">
      <section id="gpx-map" className={"gpx-editor--map-container " + (editMode+"-mode")}>
        <Map defaultCenter={[54.45, -3.03]} defaultZoom={10}
            center={center} zoom={zoom} zoomSnap={false} // maxZoom={20}
            onBoundsChanged={onBoundsChanged} animateMaxScreens={1}
            className={(editMode === "delete") && "delete-mode"}
            // provider={maptilerProvider}
        >
          {geoJsonLine && 
            <GeoJson
              data={geoJsonLine}
              styleCallback={() => {
                return { className: "gpx-editor--line" };
              }}
            />}

          {showGeoPoints && geoPoints && (zoom >= 15.5) &&
            geoPoints?.map(point => {
              return (
                <Draggable
                  pointer-events={null}
                  key={point[0]}
                  anchor={point[1]}
                  offset={[gpxPointWidth/2, gpxPointWidth/2]}
                  onDragEnd={(anchor) => moveGeoPoint(point[0], anchor)}
                  style={(editMode === "delete") && {cursor: "pointer"}}
                  className={"gpx-editor--draggable-container" + (point[0] === 0 ? " gpx-editor--start-marker" : "") + (point[0] === fullPoints.length-1 ? " gpx-editor--end-marker" : "")}
                >
                  <div className="gpx-editor--draggable" style={{width: gpxPointWidth}} onClick={() => {if (editMode === "delete") delGeoPoint(point[0])}} />
                </Draggable>
              )
            })
          }
          {fullPoints && ((zoom < 15.5) || !showGeoPoints) &&
            <Draggable
              pointer-events={null}
              key={0}
              anchor={[fullPoints[0][1], fullPoints[0][0]]}
              offset={[4, 4]}
              onDragEnd={(anchor) => moveGeoPoint(0, anchor)}
              style={(editMode === "delete") && {cursor: "pointer"}}
              className={"gpx-editor--start-marker"}
            >
              <div className="gpx-editor--draggable" style={{width: "8px"}} onClick={() => {if (editMode === "delete") delGeoPoint(0)}} />
            </Draggable>
          }

          {fullPoints && ((zoom < 15.5) || !showGeoPoints) &&
            <Draggable
              pointer-events={null}
              key={fullPoints.length-1}
              anchor={[fullPoints[fullPoints.length-1][1], fullPoints[fullPoints.length-1][0]]}
              offset={[4, 4]}
              onDragEnd={(anchor) => moveGeoPoint(fullPoints.length-1, anchor)}
              style={(editMode === "delete") && {cursor: "pointer"}}
              className={"gpx-editor--end-marker"}
            >
              <div className="gpx-editor--draggable" style={{width: "8px"}} onClick={() => {if (editMode === "delete") delGeoPoint(fullPoints.length-1)}} />
            </Draggable>
          }

          <ZoomControl style={{ top: "1.75rem", left: "1.125rem", transform: "scale(1.25)", filter: "drop-shadow(2px 2px 3px rgba(5, 5, 5, 0.25))" }} />
        </Map>

      </section>

    </main>

  </>)
}
