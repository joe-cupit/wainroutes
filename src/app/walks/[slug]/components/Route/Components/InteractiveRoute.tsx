"use client";

import styles from "../../../Walk.module.css";

import { useState } from "react";

import type { ParsedGPX } from "..";
import type MapMarker from "@/types/MapMarker";

import LakeMap, { GeoRoute } from "@/components/Map/Map";
import ElevationChart from "@/components/ElevationChart/ElevationChart";

type InteractiveRouteProps = {
  gpx: ParsedGPX;
  hillMarkers: MapMarker[];
  defaultCenter: [number, number];
  defaultZoom: number;
};

export default function InteractiveRoute({
  gpx,
  hillMarkers,
  defaultCenter,
  defaultZoom,
}: InteractiveRouteProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={styles.section}>
      <div className={styles.map}>
        <LakeMap
          gpxPoints={gpx.gpxPoints}
          primaryMarkers={hillMarkers}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
        >
          <GeoRoute points={gpx.gpxPoints} activeIndex={hoveredIndex} />
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
  );
}
