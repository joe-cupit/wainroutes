import "./index.css";

import { useEffect, useState, useMemo } from "react";
import WainroutesHelmet from "../../components/WainroutesHelmet";

import useUndoStack from "./hooks/useUndoStack";
import useOpenGpx, { GPXPoint } from "./hooks/useOpenGpx";

import GpxMap from "./components/GpxMap";

import haversine from "../../utils/haversine";
import buildXML from "./utils/buildXML";

import UploadIcon from "./assets/upload-icon.svg?react";
import DownloadIcon from "./assets/download-icon.svg?react";
import MoveIcon from "./assets/move-icon.svg?react";
import DelIcon from "./assets/del-icon.svg?react";
import UndoIcon from "./assets/undo-icon.svg?react";
import RedoIcon from "./assets/redo-icon.svg?react";
import FillIcon from "./assets/fill-icon.svg?react";
import ReverseIcon from "./assets/reverse-icon.svg?react";


export default function EditorApp() {

  // gpx file states
  const [gpxName, setGpxName] = useState<string>();
  const [gpxFile, setGpxFile] = useState<File>();
  const gpxPoints = useOpenGpx(gpxFile);

  const [gpxNodeList, setGpxNodeList] = useState<GPXPoint[]>();
  const fullPoints : [number, number][] = useMemo(() => {
    if (gpxNodeList) return gpxNodeList.map(node => node.coordinates);
    else return [];
  }, [gpxNodeList]);

  const [selectedIndex, setSelectedIndex] = useState<number>();

  // user-controlled options
  const [mapMode, setMapMode] = useState("move")
  const undoStack = useUndoStack()

  useEffect(() => {
    if (!gpxPoints) return;
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
    setGpxName(gpxFile?.name ?? "");
  }, [gpxPoints])


  const [distance, elevation] = useMemo(() => {
    if (gpxNodeList == null) return [0, 0];

    let dist = 0, elevation = 0;
    let prevP = null, prevE = 0;
    for (let node of gpxNodeList) {
      let point = node.coordinates;
      let ele = node.elevation;
      if (prevP !== null) {
        dist += haversine(point, prevP);
        if (ele && ele > prevE) elevation += (ele - prevE);
      }
      prevP = point;
      if (ele) prevE = ele;
    }

    return [dist, elevation];
  }, [gpxNodeList]);


  // // gpx point editing functions
  const reverseGpxDirection = () => {
    if (!gpxNodeList) return;

    undoStack.push([...gpxNodeList]);
    setGpxNodeList([...gpxNodeList].reverse());

    if (selectedIndex) {
      setSelectedIndex(gpxNodeList.length - selectedIndex - 1);
    }
  }
  const moveGeoPoint = (index: number, anchor: [number, number]) => {
    if (!gpxNodeList) return;

    let newGeoCoords = [...gpxNodeList];
    const newPoint : [number, number] = [Number(anchor[1].toFixed(6)), Number(anchor[0].toFixed(6))];
    if (newPoint[0] !== newGeoCoords[index].coordinates[0] || newPoint[1] !== newGeoCoords[index].coordinates[1]) {
      let newNode = {
        coordinates: newPoint,
      } as GPXPoint
      if (gpxNodeList[index].waypoint) newNode.waypoint = gpxNodeList[index].waypoint;
      newGeoCoords[index] = newNode;

      undoStack.push([...gpxNodeList]);
      setGpxNodeList(newGeoCoords);
    }

    setSelectedIndex(index);
  }
  const delGeoPoint = (index: number) => {
    if (!gpxNodeList) return;

    let newGeoCoords = [...gpxNodeList];
    newGeoCoords.splice(index, 1);

    undoStack.push([...gpxNodeList]);
    setGpxNodeList(newGeoCoords);
  }
  const waypointGeoPoint = (index: number, name: string) => {
    if (!gpxNodeList) return;

    if (name.length > 0) {
      let newGeoCoords = [...gpxNodeList];
      newGeoCoords[index].waypoint = name;

      undoStack.push([...gpxNodeList]);
      setGpxNodeList(newGeoCoords);
    }
  }


  // gpx file upload and download handlers
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGpxFile(e.target?.files?.[0]);
  }
  const handleDownloadFile = () => {
    if (!gpxNodeList) return;

    let gpxText = buildXML(gpxNodeList);

    const url = window.URL.createObjectURL(new Blob([gpxText], {type: "text/xml"}));
    let a = document.createElement("a");
    a.href = url;
    a.download = gpxName ?? "gpx_file";
    a.click();
  }


  function fillGaps() {
    if (!gpxNodeList) return;

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


  const [panValue, setPanValue] = useState<string | null>(null);

  function keyListener(e: KeyboardEvent) {
    if (!e.isTrusted) return;

    switch (e.key.toLowerCase()) {
      // case "m":
      // case "s":
      //   setMapMode("move");
      //   break;
      // case "d":
      // case "delete":
      //   setMapMode("del");
      //   break;
      // case "a":
      //   setMapMode("add");
      //   break;
      // case "f":
      //   document.getElementById("fill-button").click();
      //   break;
      // case "r":
      //   document.getElementById("reverse-button").click();
      //   break;
      case "z":
        if (e.ctrlKey) {
          if (e.shiftKey) document.getElementById("redo-button")?.click();
          else document.getElementById("undo-button")?.click();
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
    document.addEventListener("keyup", keyListener);
    return () => {document.removeEventListener("keyup", keyListener)};
  }, [])


  const [editorOpen, setEditorOpen] = useState(true);


  return (
    <main className="editor-page">
      <WainroutesHelmet
        title="GPX editor"
        description="GPX route editor app."
        canonical="/editor"
      />

      <aside className="editor__controls" data-open={editorOpen}>
        <div className="editor__controls-wrapper">
          <h1>GPX Editor</h1>

          <div className="editor__controls-group">
            <input type="file"
              id="editor-upload"
              onChange={handleUploadFile} style={{display: "none"}}
              accept=".gpx"
            />
            <button onClick={() => {document.getElementById("editor-upload")?.click()}}>
              Upload Raw GPX <UploadIcon />
            </button>
          </div>

          <div className="editor__controls-group">
            {gpxName === null
              ? <b>Upload a file</b>
              : <input
                  className="editor__controls-title"
                  placeholder={gpxFile?.name}
                  value={gpxName}
                  onChange={e => setGpxName(e.target.value)}
                  onBlur={e => {if (e.target.value === "") setGpxName(gpxFile?.name); else if (!e.target.value.endsWith(".gpx")) setGpxName(e.target.value + ".gpx")}}
                />
            }
            <p>Distance: {(distance/1000).toFixed(2)}km</p>
            <p>Elevation: {elevation.toFixed(0)}m</p>
          </div>

          {selectedIndex &&
            <CurrentPoint
              index={selectedIndex}
              point={gpxNodeList?.[selectedIndex]}
              waypointGeoPoint={waypointGeoPoint}
            />
          }

          <div className="editor__controls-group">
            <h2>Edit mode</h2>

            <input type="radio"
              name="map-mode"
              id="mode-move"
              checked={mapMode === "move"}
              onChange={() => setMapMode("move")}
            />
            <label role="button"
              htmlFor="mode-move"
              className={mapMode === "move" ? "active" : ""}
              title="Move points (m)"
            >
              <MoveIcon /> Move (m)
            </label>

            <input type="radio"
              name="map-mode"
              id="mode-del"
              checked={mapMode === "del"}
              onChange={() => setMapMode("del")}
            />
            <label role="button"
              htmlFor="mode-del"
              className={mapMode === "del" ? "active" : ""}
              title="Delete points (d)"
            >
              <DelIcon /> Delete (d)
            </label>

            {/* <input type="radio" name="map-mode" id="mode-add" checked={mapMode === "add"} onChange={() => setMapMode("add")} />
            <label htmlFor="mode-add" className={mapMode === "add" ? "active" : ""} role="button">Add (a)</label> */}
          </div>

          <div className="editor__controls-group">
            <h2>Advanced</h2>
            <button
              id="fill-button"
              onClick={fillGaps}
              title="Fill gaps (f)"
            >
              <FillIcon /> Fill gaps (f)
            </button>
            <button
              id="reverse-button"
              onClick={reverseGpxDirection}
              title="Reverse direction (r)"
            >
              <ReverseIcon /> Reverse dir. (r)
            </button>
          </div>

          <div className="editor__controls-group">
            <button id="undo-button" onClick={() => setGpxNodeList(undoStack.undo(gpxNodeList ?? []))} disabled={undoStack.undoSize === 0}>
              <UndoIcon /> Undo
            </button>
            <button id="redo-button" onClick={() => setGpxNodeList(undoStack.redo(gpxNodeList ?? []))} disabled={undoStack.redoSize === 0}>
              <RedoIcon /> Redo
            </button>
          </div>

          <button onClick={handleDownloadFile}>
            Download GPX <DownloadIcon />
          </button>
        </div>

        <button className="editor__controls-close" onClick={() => setEditorOpen(prev => !prev)}>
          {editorOpen ? "<" : ">"}
        </button>
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


function CurrentPoint({ index, point, waypointGeoPoint } : { index: number; point?: GPXPoint; waypointGeoPoint: CallableFunction }) {

  const [inputVal, setInputVal] = useState("");


  if (index && point) {
    return (
      <div className="editor__controls-group editor__controls-selected">
        <h2>{"Point " + index + (point?.waypoint ? " ("+point?.waypoint+")" : "") + ":"}</h2>
        <ul>
          <li>Long: {point?.coordinates?.[1]?.toFixed(4)}</li>
          <li>Lat: {point?.coordinates?.[0]?.toFixed(4)}</li>
          <li>Ele: {point?.elevation ? point?.elevation + "m" : "none"}</li>
        </ul>
        <label>Set a waypoint:</label>
        <div className="flex-row wrap-none">
          <input
            className="flex-1"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
          />
          <button onClick={() => waypointGeoPoint(index, inputVal)}>Set</button>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="editor__controls-group editor__controls-selected">
        <b>Select a point to view details</b>
      </div>
    )
  }
}
