"use client"

import styles from "./Map.module.css";

import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Map, Marker, GeoJson, ZoomControl, GeoJsonFeature } from "pigeon-maps";
import { AnyProps, ClusterFeature, PointFeature } from "supercluster";

import MapMarker from "@/types/MapMarker";
import { BookTitles } from "@/types/Hill";
import getMapBounds from "@/utils/getMapBounds";

import { useSupercluster } from "./hooks/useSupercluster";


// import { maptiler } from 'pigeon-maps/providers';
// const maptilerProvider = maptiler(import.meta.env.VITE_MAP_API_KEY, "topo-v2");


type LakeProps = {
  primaryMarkers?: MapMarker[];
  secondaryMarkers?: MapMarker[];
  gpxPoints?: [number, number][];
  activePoint?: string | null;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  defaultMinZoom?: number;

  disableAutomaticMapBounds?: boolean;

  children?: ReactNode;
  className?: string;
}


export default function LakeMap ({ primaryMarkers, secondaryMarkers, gpxPoints, activePoint, defaultCenter, defaultZoom, defaultMinZoom, disableAutomaticMapBounds, className, children} : LakeProps) {

  const [center, setCenter] = useState<[number, number]>(defaultCenter || [54.55, -3.09]);
  const [zoom, setZoom] = useState<number>(defaultZoom || 11);
  const [minZoom, setMinZoom] = useState<number>(defaultMinZoom || 3);
  const onBoundsChanged = ({ center, zoom } : { center: [number, number]; zoom: number }) => {
    setCenter(center);
    setZoom(zoom);
  }

  const mapMarkers = useMemo(() => (
    [...(primaryMarkers ?? []), ...(secondaryMarkers ?? [])]
  ), [primaryMarkers, secondaryMarkers])
  const secondarySlugs = useMemo(() => (
    secondaryMarkers
      ? secondaryMarkers?.map(marker => marker.properties.slug)
      : []
  ), [secondaryMarkers])

  const mapBoundPoints = useMemo(() => {
    if (!(primaryMarkers || gpxPoints)) return [];

    return [...(primaryMarkers ?? []).map(m => m.coordinates), 
            ...(gpxPoints ?? []).map(p => [p[1], p[0]] as [number, number])]
  }, [primaryMarkers, gpxPoints]);


  const resetMapBounds = useCallback(() => {
    if (!mapBoundPoints || mapBoundPoints.length === 0) return;

    const mapBounds = document.getElementById("lake-map")?.getBoundingClientRect();
    if (!mapBounds) return;

    const minLat = Math.min(...mapBoundPoints.map(p => p[0]));
    const maxLat = Math.max(...mapBoundPoints.map(p => p[0]));
    const minLon = Math.min(...mapBoundPoints.map(p => p[1]));
    const maxLon = Math.max(...mapBoundPoints.map(p => p[1]));

    const newBounds = getMapBounds([minLat, maxLat], [minLon, maxLon], mapBounds.width, mapBounds.height);

    setCenter(newBounds.center);
    setZoom(newBounds.zoom);
    setMinZoom(newBounds.zoom*0.8);
  }, [mapBoundPoints])


  useEffect(() => {
    if (!disableAutomaticMapBounds) {
      resetMapBounds();
    }
  }, [mapBoundPoints,  gpxPoints, disableAutomaticMapBounds]);


  const supercluster = useSupercluster(mapMarkers);
  const markers : (PointFeature<AnyProps> | ClusterFeature<AnyProps>)[] = useMemo(() => {
    if (!supercluster) return [];

    return supercluster.getClusters([54, -4, 55, -2], zoom)
        ?.sort((a, b) => b?.geometry?.coordinates?.[0] - a?.geometry?.coordinates?.[0]);
  }, [supercluster, zoom])

  const renderMarker = (point: PointFeature<AnyProps> | ClusterFeature<AnyProps>, key: number) => {
    try {
      const clusterItems = (point?.properties?.cluster || false)
        ? supercluster?.getLeaves(Number(point.id), Infinity)
        : [point];
      if (!clusterItems) return;

      const focussed = activePoint && clusterItems.some(marker => marker.properties.slug === activePoint);

      return (
        <Marker key={key} className={styles.marker}
                anchor={point.geometry.coordinates as [number, number]}
                onClick={() => {
                  setCenter(point.geometry.coordinates as [number, number]);
                  if (clusterItems.length > 1) setZoom((supercluster?.getClusterExpansionZoom(Number(point.id)) ?? 10)+1);
                  else {
                    if (zoom < 13) setZoom(13);
                  }
                }}
        >
          <div className={`${styles.cluster} ${focussed ? styles.focussedCluster : ""}`}>
            {clusterItems.map((item, index) => {
              return item.properties.type === "hill"
                ? <HillIcon key={index} isSecondaryMarker={secondarySlugs.includes(item.properties.slug)} book={item.properties.book} />
                : <WalkIcon key={index} isSecondaryMarker={secondarySlugs.includes(item.properties.slug)} />
            })}
          </div>
          <div className={styles.clusterTooltip}>
            {clusterItems.length > 1
              ? clusterItems.length + " "
                + (clusterItems[0].properties.type === "walk" ? "routes" : "")
                + (clusterItems[0].properties.type === "hill" ? "Wainwrights" : "")
              : <>
                  {clusterItems[0].properties.name}
                  {clusterItems[0].properties.type == "hill" &&
                    <p className={styles.clusterTooltipTip}>{BookTitles[clusterItems[0].properties.book]}</p>
                  }
                </>
            }
          </div>
        </Marker>
      )

    } catch (e) {
      console.error("Error rendering marker.\n", e);
      return <Fragment key={key}></Fragment>;
    }
  }


  useEffect(() => {
    if (!supercluster || !markers || !activePoint) {
      return;
    }

    const activeMarker = markers.filter(point => {
      const clusterItems = (point?.properties?.cluster || false)
        ? supercluster.getLeaves(Number(point.id), Infinity)
        : [point];
      if (!clusterItems) return false;

      return clusterItems.some(marker => marker.properties.slug === activePoint);
    })[0]

    setCenter([activeMarker.geometry.coordinates[0], activeMarker.geometry.coordinates[1]]);
    setZoom(12);
    // setZoom((supercluster.getClusterExpansionZoom(Number(activeMarker.id)) ?? 10)+1);
  }, [activePoint])


  useEffect(() => {
    document.getElementsByClassName("pigeon-zoom-in")[0].ariaLabel = "Zoom in";
    document.getElementsByClassName("pigeon-zoom-out")[0].ariaLabel = "Zoom out";
  }, [])


  return (
    <div id="lake-map" className={`${styles.container} ${className ?? ""}`} style={{minWidth: "100px", minHeight: "100px"}}>
      <Map center={center} zoom={zoom}
           minZoom={minZoom} zoomSnap={false}
           onBoundsChanged={onBoundsChanged}
           attributionPrefix={false}
           attribution={<Attribution />}
          //  provider={maptilerProvider}
      >
        {children}
        {markers.map(renderMarker)}
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

    return ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: points[activeIndex]
      }
    })
  }, [points, activeIndex])

  const [startPoint, endPoint] = useMemo(() => {
    if (points === null) return [null, null];

    return [
      {type: "Feature", geometry: {type: "Point", coordinates: points[0]}},
      {type: "Feature", geometry: {type: "Point", coordinates: points[points.length - 1]}}
    ]
  }, [points])

  return (points && 
    <GeoJson {...props}>
      <GeoJsonFeature feature={data} styleCallback={() => ({ className: styles.route })} />
      {endPoint &&
        <GeoJsonFeature
          feature={endPoint}
          svgAttributes={{ r: "6" }}
          styleCallback={() => ({ className: styles.endPointBottom })}
        />
      }
      {endPoint &&
        <GeoJsonFeature
          feature={endPoint}
          svgAttributes={{ r: "4" }}
          styleCallback={() => ({ className: styles.endPointTop })}
        />
      }
      {startPoint &&
        <GeoJsonFeature
          feature={startPoint}
          svgAttributes={{ r: "5" }}
          styleCallback={() => ({ className: styles.startPoint })}
        />
      }
      {activeData &&
        <GeoJsonFeature
          feature={activeData}
          svgAttributes={{ r: "8" }}
          styleCallback={() => ({ className: styles.hoveredPoint })}
        />
      }
    </GeoJson>
  )
}

function Attribution () {
  return (
    <p className={styles.attribution}>
      <a href="https://pigeon-maps.js.org/" target="_blank" aria-label="Pigeon Maps">Pigeon</a> | © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors
    </p>
  )
}


// icons
function HillIcon({ isSecondaryMarker, book }: { isSecondaryMarker: boolean; book: number}) {
  return (
    <svg
      viewBox="-1 -1 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.hillMarker}
      data-is-secondary={isSecondaryMarker}
      data-book={book}
    >
      <path
        d="M9.40299 0.115232C6.62504 -1.14122 4.02295 8.18122 1.12913 13.2782C0.716591 14.0048 1.22828 15 2.06385 15H13.3945C14.1348 15 14.6249 14.2212 14.3379 13.5387C12.0483 8.09234 10.632 0.671093 9.40299 0.115232Z"
        style={{ pointerEvents: "auto" }}
      />
    </svg>
  )
}

function WalkIcon({ isSecondaryMarker } : { isSecondaryMarker: boolean;  }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      data-is-secondary={isSecondaryMarker}
    >
      <path
        d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        style={{ pointerEvents: "auto" }}
      />
    </svg>
  )
}
