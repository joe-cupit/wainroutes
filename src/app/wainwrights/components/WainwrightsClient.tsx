"use client"

import styles from "../Wainwrights.module.css";

import type MapMarker from "@/types/MapMarker";
import type { SimplifiedHill } from "../page";

import LakeMap from "@/components/Map/Map";
import WainwrightList from "./WainwrightList";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookTitles } from "@/types/Hill";


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

  const searchParams = useSearchParams();
  const book = Number(searchParams.get("book"));

  const [filteredHillData, filteredHillMarkers] = useMemo(() => {
    if (book && BookTitles[Number(book)]) {
      return ([
        simplifiedHillData.filter(hill => hill.book === book),
        hillMarkers.filter(marker => marker.properties.book === book)
      ])
    }
    else return ([
      simplifiedHillData, hillMarkers
    ])
  }, [book, simplifiedHillData])


  return (
    <>
      <div className={styles.books}>
        {/* <button
          onClick={() => window.history.replaceState({}, "", "/wainwrights")}
          data-active={BookTitles[book] === undefined}
        >
          All fells
        </button> */}
        {Object.keys(BookTitles).map((b, index) => (
          <button key={index}
            onClick={() => window.history.replaceState({}, "",
              (Number(b) === book)
               ? "/wainwrights"
               : `/wainwrights?book=${b}`
            )}
            data-active={Number(b) === book}
            data-book={b}
          >
            {BookTitles[Number(b)]}
          </button>
        ))}
      </div>

      <div className={styles.group}>
        <WainwrightList
          simplifiedHills={filteredHillData}
          setHoveredSlug={setHoveredSlug}
          book={book}
        />

        <div className={styles.map}>
          <LakeMap
            primaryMarkers={filteredHillMarkers}
            activePoint={hoveredSlug}
            defaultCenter={mapBounds.center}
            defaultZoom={mapBounds.zoom}
          />
        </div>
      </div>
    </>
  )
}
