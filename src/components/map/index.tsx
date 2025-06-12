import "./index.css";

import { Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import { Map, Marker, GeoJson, ZoomControl, GeoJsonFeature } from "pigeon-maps";
import { useSupercluster } from "./hooks/useSupercluster";
import { Link } from "react-router-dom";
import { MapMarker } from "../../hooks/useMarkers";
import { AnyProps, ClusterFeature, PointFeature } from "supercluster";
import { BookTitles } from "../../pages/HillPage";

// import { maptiler } from 'pigeon-maps/providers';
// const maptilerProvider = maptiler(import.meta.env.VITE_MAP_API_KEY, "topo-v2");

// const geoViewport = require('@mapbox/geo-viewport');


type LakeProps = {
  mapMarkers?: MapMarker[] | undefined;
  gpxPoints?: [number, number][] | undefined;
  activePoint?: string | null;
  defaultCenter?: [number, number];
  defaultZoom?: number;

  children?: ReactNode | undefined;
  className?: string;
}


// main component
export function LakeMap ({ mapMarkers, gpxPoints, activePoint, defaultCenter, defaultZoom, className, children} : LakeProps) {

  const [center, setCenter] = useState<[number, number]>(defaultCenter || [54.55, -3.09]);
  const [zoom, setZoom] = useState<number>(defaultZoom || 11);
  const [minZoom, setMinZoom] = useState<number>(3);
  const onBoundsChanged = ({ center, zoom } : { center: [number, number]; zoom: number }) => {
    setCenter(center);
    setZoom(zoom);
  }

  const mapPoints = useMemo(() => {
    if (!(mapMarkers || gpxPoints)) return [];

    return [...(mapMarkers ?? []).map(m => m.coordinates), 
            ...(gpxPoints ?? []).map(p => [p[1], p[0]] as [number, number])]
  }, [mapMarkers, gpxPoints]);

  useEffect(() => {
    if (!mapPoints || mapPoints.length === 0
        || !document?.getElementById("lake-map")) return;

    let minLat = 999.0; let maxLat = -999.0;
    let minLong = 999.0; let maxLong = -999.0;
    for (let point of mapPoints) {
      const [lat, long] = point;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (long < minLong) minLong = long;
      if (long > maxLong) maxLong = long;
    }

    // const mapBounds = document.getElementById("lake-map").getBoundingClientRect()
    // const { center, zoom } = geoViewport.viewport(
    //   [minLat, minLong, maxLat, maxLong], [mapBounds.width, mapBounds.height], 0, 20, 256, true, true
    // )

    // setCenter([center[0]+(!gpxPoints ? 0.015 : 0), center[1]]);
    // setZoom(zoom*0.98);
    // setMinZoom(zoom*0.83);

    const mapBounds = document.getElementById("lake-map")?.getBoundingClientRect();
    if (mapBounds) {
      let newcenter = [(minLat+maxLat)/2, (minLong+maxLong)/2] as [number, number];
      let newzoom = Math.min(-Math.max(Math.log((maxLat-minLat)/(mapBounds.height-100))/Math.log(2), Math.log((maxLong-minLong)/(mapBounds.width))/Math.log(2)), 14);
  
      setCenter(newcenter);
      setZoom(newzoom*0.98);
      setMinZoom(newzoom*0.75);
    }

  }, [mapPoints, gpxPoints]);


  const supercluster = useSupercluster(mapMarkers);
  const [markers, setMarkers] = useState<(PointFeature<AnyProps> | ClusterFeature<AnyProps>)[]>();
  useEffect(() => {
    if (supercluster === null) return;

    setMarkers(
      supercluster?.getClusters([54, -4, 55, -2], zoom)
        ?.sort((a, b) => b?.geometry?.coordinates?.[0] - a?.geometry?.coordinates?.[0])
    );
  }, [supercluster, zoom])

  const renderMarker = (point: PointFeature<AnyProps> | ClusterFeature<AnyProps>, key: number) => {
    try {
      const clusterItems = (point?.properties?.cluster || false)
        ? supercluster?.getLeaves(Number(point.id), Infinity)
        : [point];
      
      if (!clusterItems) return;
      
      var focussed = false;
      if (activePoint) {
        for (let marker of clusterItems) {
          if (activePoint === marker.properties.slug) focussed = true;
        }
      }

      return (
        <Marker key={key} className="lake-map--marker"
                anchor={point.geometry.coordinates as [number, number]}
                onClick={() => {
                  setCenter(point.geometry.coordinates as [number, number]);
                  if (clusterItems.length > 1) setZoom((supercluster?.getClusterExpansionZoom(Number(point.id)) ?? 10)+1);
                  else {
                    console.log("show details for", point?.properties?.name);
                    if (zoom < 13) setZoom(13);
                  }
                }}
        >
          <>
            <div className={"lake-map--cluster" + (focussed ? " focussed-cluster" : "")}>
              {clusterItems.map((item, index) => {
                return item.properties.type === "hill"
                  ? <HillIcon key={index} book={item.properties.book as number} />
                  : <WalkIcon key={index} />
              })}
            </div>
            <div className="lake-map--cluster_tooltip">
              {clusterItems.length > 1
                ? clusterItems.length + " " + clusterItems[0].properties.type + "s"
                : <>
                    {clusterItems[0].properties.name}
                    {clusterItems[0].properties.type == "hill" &&
                      <p className="lake-map--cluster_tooltip-tip">{BookTitles[clusterItems[0].properties.book]}</p>
                    }
                  </>
              }
            </div>
          </>
        </Marker>
      )

    } catch (e) {
      console.error("Error rendering marker.\n", e);
      return <Fragment key={key}></Fragment>;
    }
  }

  useEffect(() => {
    document.getElementsByClassName("pigeon-zoom-in")[0].ariaLabel = "Zoom in";
    document.getElementsByClassName("pigeon-zoom-out")[0].ariaLabel = "Zoom out";
  }, [])


  return (
    <div id="lake-map" className={className ? "lake-map--container "+className : "lake-map--container"} style={{minWidth: "100px", minHeight: "100px"}}>
      <Map center={center} zoom={zoom}
           minZoom={minZoom} zoomSnap={false}
           onBoundsChanged={onBoundsChanged}
           attributionPrefix={false}
           attribution={<Attribution />}
          //  provider={maptilerProvider}
      >
        {children}
        {markers?.map(renderMarker)}
        <ZoomControl />
      </Map>
    </div>
  )
}


// secondary components
export function GeoRoute ({ points, activeIndex, ...props } : { points: [number, number][]; activeIndex: number | null }) {

  const data = useMemo(() => ({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: points
    }
  }), [points])

  const activeData = useMemo(() => {
    if (points === null || activeIndex === null) return null;
    else return ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: points[activeIndex]
      }
    })
  }, [points, activeIndex])

  return (points && 
    <GeoJson {...props}>
      <GeoJsonFeature feature={data} styleCallback={() => ({ className: "lake-map--route" })} />
      {activeData &&
        <GeoJsonFeature feature={activeData}
          svgAttributes={{ r: "8" }}
          styleCallback={() => ({ className: "lake-map--hovered-point" })}
        />}
    </GeoJson>
  )
}

function Attribution () {
  return (
    <p className="lake-map--attribution">
      <Link to="https://pigeon-maps.js.org/" target="_blank" aria-label="Pigeon Maps">Pigeon</Link> | © <Link to="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</Link> contributors
    </p>
  )
}


// icons
function HillIcon({ book }: { book: number}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -4 4 4" className={`lake-map--hill-marker wain-book-${book}`}>
      <path
        d="M0 0 2-4 4 0Z"
        style={{ pointerEvents: "auto", strokeWidth: 0.175 }}
      />
    </svg>
  )
}

function WalkIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        style={{ pointerEvents: "auto" }}
      />
    </svg>
  )
}
