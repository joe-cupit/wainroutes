"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";

import type { SimpleWalk } from "../page";
import styles from "../Walks.module.css";

import WalkGrid from "./WalkGrid";
import WalksSearchBar from "./WalkSearchBar";


type WalksClientProps = {
  initialWalks: SimpleWalk[];
}

export default function WalksClient({ initialWalks } : WalksClientProps) {
  
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

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

  const searchedWalks = useMemo(() => {
    if (query.length > 0) {
      return (
        searchableWalks
          .search(query)
          .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
          .map(res => res.item)
      );
    }
    else return initialWalks;
  }, [initialWalks, searchableWalks, query])

  
  return (
    <div className={styles.main}>
      <WalksSearchBar />
      <WalkGrid
        walks={searchedWalks}
        resetFilters={resetFilters}
        // hasLocationParam={(currentTown in locations)}
      />
    </div>
  )
}
