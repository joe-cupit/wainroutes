import { useState, useMemo, useEffect } from "react";
import { Map, GeoJson, ZoomControl, Draggable, Overlay } from "pigeon-maps";
// import zoomToFit from "../utils/zoomToFit";


export default function GpxMap({ gpxPoints, mapMode, moveGeoPoint, delGeoPoint, panValue }) {

  const [center, setCenter] = useState([54.45, -3.03]);
  const [zoom, setZoom] = useState(10);
  const [bounds, setBounds] = useState({ne: [55, 0], sw: [50, -4]});
  const onBoundsChanged = ({ center, zoom, bounds }) => {
    setCenter(center);
    setZoom(zoom);
    setBounds(bounds);
  }
  const gpxPointWidth = useMemo(() => 2*zoom-24, [zoom]);


  const geoJsonLine = useMemo(() => (gpxPoints ? {type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "LineString", coordinates: gpxPoints}}]} : null), [gpxPoints]);
  const geoJsonPoints = useMemo(() => {
    const inBounds = (point) => {
      let coords = point[1];
      const maxBound = bounds.ne;
      const minBound = bounds.sw;

      if (coords[1] > maxBound[1] || coords[1] < minBound[1]) return false;
      if (coords[0] > maxBound[0] || coords[0] < minBound[0]) return false;
      return true;
    }

    return gpxPoints?.map((point, index) => [index, [point[1], point[0]]])?.filter(inBounds);
  }, [gpxPoints, bounds]);


  // // center map when receiving new points
  // function centerMap() {
  //   if (!gpxPoints?.length > 0) return

  //   const [newCenter, newZoom] = zoomToFit(gpxPoints)
  //   setCenter(newCenter)
  //   setZoom(newZoom)
  // }


  useEffect(() => {
    if (panValue === null) return;

    const ewChange = (bounds.sw[1] - bounds.ne[1]) / 12;
    const nsChange = (bounds.ne[0] - bounds.sw[0]) / 10;

    switch (panValue) {
      case "up":
        setCenter([center[0]+nsChange, center[1]]);
        break;
      case "down":
        setCenter([center[0]-nsChange, center[1]]);
        break;
      case "left":
        setCenter([center[0], center[1]+ewChange]);
        break;
      case "right":
        setCenter([center[0], center[1]-ewChange]);
        break;
      default:
        break;
    }
  }, [panValue]);


  return (
    <Map defaultCenter={[54.45, -3.03]} center={center} 
         defaultZoom={10} zoom={zoom} zoomSnap={false}
         onBoundsChanged={onBoundsChanged} animateMaxScreens={10}
    >
      {geoJsonLine 
        ? <GeoJson
            data={geoJsonLine}
            styleCallback={() => {
              return { className: "editor-map_route" };
            }}
          />
        : <></>
      }

      {geoJsonPoints && (zoom >= 15.5) &&
        (mapMode === "move"
        ? geoJsonPoints?.map(point => {
            return (
              <Draggable
                key={point[0]}
                anchor={point[1]}
                offset={[gpxPointWidth/2, gpxPointWidth/2]}
                onDragEnd={(anchor) => {if (mapMode === "move") moveGeoPoint(point[0], anchor)}}
              >
                <div className="editor-map_point" style={{width: gpxPointWidth}} />
              </Draggable>
            )
          })
        : geoJsonPoints?.map(point => {
            return (
              <Overlay
                key={point[0]}
                anchor={point[1]}
                offset={[gpxPointWidth/2, gpxPointWidth/2]}
                style={mapMode === "del" ? {cursor: "pointer"} : {}}
              >
                <div className="editor-map_point" style={{width: gpxPointWidth}} onClick={() => {if (mapMode === "del") delGeoPoint(point[0])}} />
              </Overlay>
            )
          })
        )
      }

      <ZoomControl />
    </Map>
  )
}
