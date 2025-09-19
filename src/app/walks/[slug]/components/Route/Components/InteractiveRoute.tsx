"use client";

import styles from "../../../Walk.module.css";

import { useState } from "react";

import type { ParsedGPX } from "..";
import type MapMarker from "@/types/MapMarker";
import LakeMap, { GeoRoute } from "@/components/Map/Map";
import ElevationChart from "@/components/ElevationChart/ElevationChart";


export default function InteractiveRoute({ gpx, hillMarkers, defaultCenter } : { gpx: ParsedGPX, hillMarkers: MapMarker[]; defaultCenter: [number, number] }) {

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  return (
    <div className={styles.section}>
      <div className={styles.map}>
        <LakeMap
          gpxPoints={gpx.gpxPoints}
          mapMarkers={hillMarkers}
          defaultCenter={defaultCenter}
          defaultZoom={14}
        >
          <GeoRoute
            points={gpx.gpxPoints}
            activeIndex={hoveredIndex}
          />
        </LakeMap>
      </div>
      <div className={styles.elevation}>
        <ElevationChart
          data={gpx.elevationData}
          setActiveIndex={setHoveredIndex}
          showHillMarkers={true}
        />
      </div>
    </div>
  )
}