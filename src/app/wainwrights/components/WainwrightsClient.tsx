"use client"

import styles from "../Wainwrights.module.css";

import type MapMarker from "@/types/MapMarker";
import type { SimplifiedHill } from "../page";

import LakeMap from "@/components/Map/Map";
import WainwrightList from "./WainwrightList";
import { useState } from "react";


type WainwrightsClientProps = {
  simplifiedHillData: SimplifiedHill[]
  hillMarkers: MapMarker[]
  mapBounds: {
    center: [number, number]
    zoom: number
  }
}


export default function WainwrightsClient({ simplifiedHillData, hillMarkers, mapBounds } : WainwrightsClientProps) {

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);


  return (
    <>
      <WainwrightList
        simplifiedHills={simplifiedHillData}
        setHoveredSlug={setHoveredSlug}
      />

      <div className={styles.map}>
        <LakeMap
          primaryMarkers={hillMarkers}
          activePoint={hoveredSlug}
          defaultCenter={mapBounds.center}
          defaultZoom={mapBounds.zoom}
        />
      </div>
    </>
  )
}
