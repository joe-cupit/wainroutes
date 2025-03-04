import "./index.css"

import { useEffect, useState, useMemo } from "react"

import useUndoStack from "./hooks/useUndoStack"
import useOpenGpx from "./hooks/useOpenGpx"

import haversine from "../../utils/haversine"
import buildXML from "./utils/buildXML"

import GpxMap from "./components/GpxMap"


export default function EditorApp() {

  document.title = "GPX Editor | wainroutes"

  // gpx file states
  const [gpxFile, setGpxFile] = useState(null)
  const gpxPoints = useOpenGpx(gpxFile)

  const [gpxNodeList, setGpxNodeList] = useState(null);
  const fullPoints = useMemo(() => {
    return gpxNodeList?.map(node => node.coordinates);
  }, [gpxNodeList]);

  const [selectedIndex, setSelectedIndex] = useState(null);

  // user-controlled options
  const [mapMode, setMapMode] = useState("move")
  const undoStack = useUndoStack()

  useEffect(() => {
    if (gpxPoints == null) return;
    let geoPoints = [];

    let prevP = null;
    for (let node of gpxPoints) {
      let point = node.coordinates;
      if (prevP !== null) {
        if (haversine(point, prevP) < 15) {
          continue;
        }
        if (haversine(point, prevP) > 25) {
          prevP = point;
          continue;
        }
      }

      geoPoints.push(node);
      prevP = point;
    }

    undoStack.reset();
    setGpxNodeList(geoPoints);
  }, [gpxPoints])


  const [distance, elevation] = useMemo(() => {
    if (gpxNodeList == null) return [0, 0]

    let dist = 0//, elevation = 0
    let prevP = null//, prevE = null
    for (let node of gpxNodeList) {
      let point = node.coordinates;
      //let ele = node.elevation
      if (prevP !== null) {
        dist += haversine(point, prevP)
        //if (ele > prevE) elevation += (ele - prevE)
      }
      prevP = point
      //prevE = ele
    }

    return [dist, 0]
  }, [gpxNodeList])


  // // gpx point editing functions
  const reverseGpxDirection = () => {
    if (gpxNodeList === null) return;

    undoStack.push([...gpxNodeList]);
    setGpxNodeList([...gpxNodeList].reverse());

    if (selectedIndex) {
      setSelectedIndex(gpxNodeList.length - selectedIndex - 1);
    }
  }
  const moveGeoPoint = (index, anchor) => {
    let newGeoCoords = [...gpxNodeList];
    newGeoCoords[index].coordinates = [anchor[1], anchor[0]];
    
    undoStack.push([...gpxNodeList]);  // TODO: isn't working??
    setGpxNodeList(newGeoCoords);
    setSelectedIndex(index);
  }
  const delGeoPoint = (index) => {
    let newGeoCoords = [...gpxNodeList];
    newGeoCoords.splice(index, 1);

    undoStack.push([...gpxNodeList]);
    setGpxNodeList(newGeoCoords);
  }
  const waypointGeoPoint = (index, name) => {
    let newGeoCoords = [...gpxNodeList];
    newGeoCoords[index].waypoint = name;

    undoStack.push([...gpxNodeList]);
    setGpxNodeList(newGeoCoords);
  }


  // gpx file upload and download handlers
  const handleUploadFile = (e) => {
    setGpxFile(e.target.files[0])
  }
  const handleDownloadFile = () => {
    let gpxText = buildXML(gpxNodeList)

    const url = window.URL.createObjectURL(new Blob([gpxText], {type: "text/xml"}))
    let a = document.createElement("a")
    a.href = url
    a.download = "wainroute.gpx"
    a.click()
  }


  function fillGaps() {
    let newFullPoints = [...gpxNodeList];
    var extraPoints = 0;

    let prevP = gpxNodeList[0].coordinates;
    for (let i=1; i<gpxNodeList.length; i++) {
      const point = gpxNodeList[i].coordinates;
      let dist = haversine(prevP, point);

      while (dist > 30) {
        let ratio = 15 / dist;
        let x = (1 - ratio) * prevP[0] + ratio * point[0];
        let y = (1 - ratio) * prevP[1] + ratio * point[1];
        prevP = [x, y];

        newFullPoints.splice(i+extraPoints, 0, {coordinates: prevP});
        extraPoints++;

        dist = haversine(prevP, point);
      }

      prevP = point
    }

    if (extraPoints > 0) {
      undoStack.push([...gpxNodeList])
      setGpxNodeList(newFullPoints)
    }
  }


  const [panValue, setPanValue] = useState(null)

  function keyListener(e) {
    if (!e.isTrusted) return

    switch (e.key.toLowerCase()) {
      case "m":
      case "s":
        setMapMode("move");
        break;
      case "d":
      case "delete":
        setMapMode("del");
        break;
      case "a":
        setMapMode("add");
        break;
      case "w":
        setMapMode("waypoint");
        break;
      case "f":
        document.getElementById("fill-button").click();
        break;
      case "r":
        document.getElementById("reverse-button").click();
        break;
      case "z":
        if (e.ctrlKey) {
          if (e.shiftKey) document.getElementById("redo-button").click();
          else document.getElementById("undo-button").click();
          break;
        }
      case "arrowup":
        setPanValue("up");
        setTimeout(() => setPanValue(null), 100);
        break;
      case "arrowdown":
        setPanValue("down");
        setTimeout(() => setPanValue(null), 100);
        break;
      case "arrowleft":
        setPanValue("left");
        setTimeout(() => setPanValue(null), 100);
        break;
      case "arrowright":
        setPanValue("right");
        setTimeout(() => setPanValue(null), 100);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    document.addEventListener("keyup", keyListener)
    return () => {document.removeEventListener("keyup", keyListener)}
  }, [])


  return (
    <main className="editor-page">
      <aside className="editor-controls">
        <h1>wainroutes route gpx editor</h1>

        <input type="file" id="editor-upload" onChange={handleUploadFile} style={{display: "none"}} />
        <button onClick={() => {document.getElementById("editor-upload").click()}}>Upload GPX</button>

        <p>Distance: {(distance/1000).toFixed(2)}km</p>
        <p>Elevation: {elevation.toFixed(0)}m</p>

        <div>
          <h2>Selected point</h2>
          <CurrentPoint
            index={selectedIndex}
            point={gpxNodeList?.[selectedIndex]}
            waypointGeoPoint={waypointGeoPoint}
          />
        </div>

        <div>
          <h2>Version control</h2>
          <button id="undo-button" onClick={() => setGpxNodeList(undoStack.undo(gpxNodeList))} disabled={undoStack.undoSize === 0}>Undo</button>
          <button id="redo-button" onClick={() => setGpxNodeList(undoStack.redo(gpxNodeList))} disabled={undoStack.redoSize === 0}>Redo</button>
        </div>

        <div>
          <h2>Map edit mode</h2>
          <input type="radio" name="map-mode" id="mode-move" checked={mapMode === "move"} onChange={() => setMapMode("move")} />
          <label htmlFor="mode-move" className={mapMode === "move" ? "active" : ""} role="button">Move (m)</label>
          <input type="radio" name="map-mode" id="mode-del" checked={mapMode === "del"} onChange={() => setMapMode("del")} />
          <label htmlFor="mode-del" className={mapMode === "del" ? "active" : ""} role="button">Delete (d)</label>
          <input type="radio" name="map-mode" id="mode-add" checked={mapMode === "add"} onChange={() => setMapMode("add")} />
          <label htmlFor="mode-add" className={mapMode === "add" ? "active" : ""} role="button">Add (a)</label>
          <input type="radio" name="map-mode" id="mode-waypoint" checked={mapMode === "waypoint"} onChange={() => setMapMode("waypoint")} />
          <label htmlFor="mode-waypoint" className={mapMode === "waypoint" ? "active" : ""} role="button">Waypoint (w)</label>
        </div>

        <div>
          <h2>Advanced options</h2>
          <button id="fill-button" onClick={fillGaps}>Fill gaps (f)</button>
          <button id="reverse-button" onClick={reverseGpxDirection}>Reverse direction (r)</button>
        </div>

        <button onClick={handleDownloadFile}>Download GPX</button>
      </aside>

      <div id="editor-map" className="editor-map" data-mode={mapMode}>
        <GpxMap gpxPoints={fullPoints}
                mapMode={mapMode}
                moveGeoPoint={moveGeoPoint}
                delGeoPoint={delGeoPoint}
                panValue={panValue}
        />
      </div>

    </main>
  )
}


function CurrentPoint({ index, point, waypointGeoPoint }) {

  const [inputVal, setInputVal] = useState("");


  if (index) {
    return (
      <div>
        <b>{"Point " + index + (point?.waypoint ? " ("+point?.waypoint+")" : "") + ":"}</b>
        <p>{point?.coordinates?.[1]?.toFixed(4) + ", " + point?.coordinates?.[0]?.toFixed(4)}</p>
        <p>{point?.elevation + "m"}</p>
        <label>Add a waypoint name:</label>
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyUp={e => e.preventDefault()} />
        <button onClick={() => waypointGeoPoint(index, inputVal)}>Set</button>
      </div>
    )
  }
  else {
    return (
      <div>None selected</div>
    )
  }
}
