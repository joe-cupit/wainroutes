"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";

import type { SimpleWalk } from "../page";
import styles from "../Walks.module.css";

import WalkGrid from "./WalkGrid";
import WalksSearchBar from "./WalkSearchBar";
import WalkFilters from "./WalkFilters";
import { distanceValues, elevationValues } from "./WalkFilterValues";


type WalksClientProps = {
  initialWalks: SimpleWalk[];
}

export default function WalksClient({ initialWalks } : WalksClientProps) {
  
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const resetFilters = useCallback(() => {
    window.history.replaceState({}, "", `/walks`)
  }, [])


  const searchableWalks = useMemo(() => {
    return new Fuse(initialWalks, {
      keys: ["title", "wainwrights", "startLocation.location", "tags"],
      threshold: 0.25,
      includeScore: true,
    })
  }, [initialWalks])

  const filteredWalks = useMemo(() => {
    let newWalks = [...initialWalks];

    const query = searchParams.get("query") ?? "";
    if (query.length > 0) {
      newWalks = searchableWalks
                  .search(query)
                  .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
                  .map(res => res.item)
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
  }, [initialWalks, searchableWalks, searchParams])

  
  return (
    <div className={styles.main}>
      <div style={{zIndex: "9999"}}>
        <WalksSearchBar
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        {showFilters &&
          <WalkFilters
            resetFilters={resetFilters}
            className={styles.filters}
          />
        }
      </div>
      <WalkGrid
        walks={filteredWalks}
        resetFilters={resetFilters}
        // hasLocationParam={(currentTown in locations)}
      />
    </div>
  )
}
