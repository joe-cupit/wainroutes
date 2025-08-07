"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";

import type { SimpleWalk } from "../page";
import styles from "../Walks.module.css";

import WalkGrid from "./WalkGrid";
import WalksSearchBar from "./WalkSearchBar";
import WalkFilters from "./WalkFilters";
import { distanceValues, elevationValues, locations } from "./WalkFilterValues";
import haversineDistance from "@/utils/haversineDistance";


type WalksClientProps = {
  allWalks: SimpleWalk[];
  wainNames: {[slug : string]: string};
}

export default function WalksClient({ allWalks, wainNames } : WalksClientProps) {

  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const resetFilters = useCallback(() => {
    window.history.replaceState({}, "", `/walks`)
  }, [])

  const townParam = useMemo(() => {
    return searchParams.get("town");
  }, [searchParams])
  useEffect(() => {
    const titleElement = document.getElementById("walks-title");

    if (townParam && locations[townParam]) {
      const location = locations[townParam];
      if (titleElement) titleElement.innerText = `Walks near ${location.name}`;
      document.title = `Lake District Walks near ${location.name} | Wainroutes`;
    }
    else {
      if (titleElement) titleElement.innerText = "Walks in the Lake District";
      document.title = "Lake District Walks | Wainroutes";
    }
  }, [townParam])


  const searchableWalks = useMemo(() => {
    return new Fuse(allWalks, {
      keys: ["title", "wainwrights", "startLocation.location", "tags"],
      threshold: 0.25,
      includeScore: true,
    })
  }, [allWalks])

  const filteredWalks = useMemo(() => {
    let newWalks = [...allWalks];

    const query = searchParams.get("query") ?? "";
    if (query.length > 0) {
      newWalks = searchableWalks
                  .search(query)
                  .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
                  .map(res => res.item)
    }

    const town = searchParams.get("town");
    if (town && locations[town]) {
      const townCoords = locations[town].coords;
      for (const walk of newWalks) {
        walk.distance = haversineDistance(townCoords, [walk.startLocation?.longitude ?? 0, walk.startLocation?.latitude ?? 0]) / 1000;
      }
      newWalks = newWalks.filter(walk => walk.distance! < (locations[town]?.distScale ?? 1) * 10);
    }

    const distance = searchParams.get("distance");
    if (distance) {
      const distBoundaries = distanceValues[distance];
      if (distBoundaries?.[0]) newWalks = newWalks.filter(w => w.length >= distBoundaries[0]);
      if (distBoundaries?.[1]) newWalks = newWalks.filter(w => w.length <= distBoundaries[1]);
    }

    const elevation = searchParams.get("elevation");
    if (elevation) {
      const eleBoundaries = elevationValues[elevation];
      if (eleBoundaries?.[0]) newWalks = newWalks.filter(w => w.elevation >= eleBoundaries[0]);
      if (eleBoundaries?.[1]) newWalks = newWalks.filter(w => w.elevation <= eleBoundaries[1]);
    }

    const wainwrights = searchParams.get("wainwrights");
    if (wainwrights) {
      const validSlugs = wainwrights.split(" ");
      console.log(wainwrights, validSlugs)
      if (validSlugs.length > 0) newWalks = newWalks.filter(w => w.wainwrights.some(s => validSlugs.includes(s)));
    }

    const byBus = searchParams.get("byBus");
    if (byBus === "yes") {
      newWalks = newWalks.filter(w => Object.keys(w.busConnections ?? {}).length > 0);
    }

    return newWalks;
  }, [allWalks, searchableWalks, searchParams])


  return (
    <div className={styles.main}>
      <div style={{zIndex: "9999"}}>
        <WalksSearchBar
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        {showFilters &&
          <WalkFilters
            className={styles.filters}
            wainNames={wainNames}
          />
        }
      </div>
      <WalkGrid
        walks={filteredWalks}
        wainNames={wainNames}
        resetFilters={resetFilters}
        showDistances={Boolean(townParam && locations[townParam])}
      />
    </div>
  )
}
