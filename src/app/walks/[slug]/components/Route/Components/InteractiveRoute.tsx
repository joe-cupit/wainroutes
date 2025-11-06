"use client";

import styles from "../../../Walk.module.css";

import { useCallback, useState } from "react";

import type { ParsedGPX } from "..";
import type MapMarker from "@/types/MapMarker";

import LakeMap, { GeoRoute } from "@/components/Map/Map";
import ElevationChart from "@/components/ElevationChart/ElevationChart";
import { DownloadIcon } from "@/icons/PhosphorIcons";

type InteractiveRouteProps = {
  slug: string;
  gpx: ParsedGPX;
  hillMarkers: MapMarker[];
  defaultCenter: [number, number];
  defaultZoom: number;
};

export default function InteractiveRoute({
  slug,
  gpx,
  hillMarkers,
  defaultCenter,
  defaultZoom,
}: InteractiveRouteProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = `/download/gpx/${slug}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [slug]);

  return (
    <div className={styles.section}>
      <div className={styles.map}>
        <LakeMap
          gpxPoints={gpx.gpxPoints}
          primaryMarkers={hillMarkers}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapButtons={[
            {
              title: "Download GPX file",
              onClick: handleDownload,
              Icon: <DownloadIcon />,
            },
          ]}
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
