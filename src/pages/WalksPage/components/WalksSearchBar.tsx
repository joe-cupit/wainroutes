import { useEffect, useMemo, useRef, useState } from "react";

import { Filters } from "./Filters";
import { CloseIcon, CloseIconSmall, FilterIcon, SearchIcon } from "../../../components/Icons";
import Fuse from "fuse.js";
import { Walk } from "../../WalkPage/WalkPage";
import { useWalks } from "../../../contexts/WalksContext";
import { useSearchParams } from "react-router-dom";
import haversineDistance from "../../../utils/haversine";
import { useFilters } from "../contexts/FilterContext";
import { distanceValues, elevationValues, locations } from "../utils/FilterValues";


export default function WalksSearchBar({ setFilteredWalks } : { setFilteredWalks: CallableFunction }) {
  
  const allWalks = useWalks().walks;
  const { filters, filterObjects } = useFilters();

  const [urlSearchParams, setUrlSearchParams] = useSearchParams();

  const searchRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState(urlSearchParams.get("query") ?? "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useEffect(() => {
    if (searchTerm === "") {
      setDebouncedSearchTerm("")
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm])
  
  const [showFilters, setShowFilters] = useState(false);

  const walkData : Walk[] = useMemo(() => {
    if (!allWalks) return [];
    let newWalkData = [...allWalks];

    if (locations[filters.town]) {
      const centerLoc = locations[filters.town];
      if (centerLoc) {
        for (let walk of newWalkData) {
          walk.distance = haversineDistance(centerLoc.coords, [walk.startLocation?.longitude ?? 0, walk.startLocation?.latitude ?? 0]) / 1000;
        }
        newWalkData = newWalkData.filter(walk => walk.distance! < 10 * (centerLoc.distScale ?? 1))
      }
    }

    return newWalkData;
  }, [allWalks, filters.town]);

  const searchableWalks = useMemo(() => {
    if (!walkData) return;

    return new Fuse(walkData, {
      keys: ["title", "wainwrights", "startLocation.location", "tags"],
      threshold: 0.25,
      includeScore: true
    })
  }, [walkData, filters.town])

  const [searchedWalkObjects, setSearchedWalkObjects] = useState<{walk: Walk, score: number}[]>([]);
  useEffect(() => {
    if (!searchableWalks || !walkData) return;
    if (!debouncedSearchTerm) {
      urlSearchParams.delete("query");
      setUrlSearchParams(urlSearchParams);
      setSearchedWalkObjects(walkData?.map(walk => ({walk: walk, score: 0})));
    }
    else {
      urlSearchParams.set("query", debouncedSearchTerm);
      setUrlSearchParams(urlSearchParams);
      setSearchedWalkObjects(searchableWalks.search(debouncedSearchTerm).map(res => ({walk: res.item, score: (res.score ?? 0)})));
    }
  }, [searchableWalks, debouncedSearchTerm])

  useEffect(() => {
    let filteredWalkObjects = searchedWalkObjects.sort((a, b) => a.score - b.score).map(obj => obj.walk);

    // filter walk distance
    if (filters.distance !== "any") {
      let distBoundaries = distanceValues[filters.distance];
      if (distBoundaries[0]) {
        filteredWalkObjects = filteredWalkObjects.filter(walk => walk.length >= distBoundaries[0]);
      }
      if (distBoundaries[1]) {
        filteredWalkObjects = filteredWalkObjects.filter(walk => walk.length <= distBoundaries[1]);
      }
    }

    // filter total elevation
    if (filters.elevation !== "any") {
      let eleBoundaries = elevationValues[filters.elevation];
      if (eleBoundaries[0]) {
        filteredWalkObjects = filteredWalkObjects.filter(walk => walk.elevation >= eleBoundaries[0]);
      }
      if (eleBoundaries[1]) {
        filteredWalkObjects = filteredWalkObjects.filter(walk => walk.elevation <= eleBoundaries[1]);
      }
    }

    // filter walk wainwrights
    if (filters.wainwrights.length > 0) {
      filteredWalkObjects = filteredWalkObjects.filter(walk => walk.wainwrights.some(w => filters.wainwrights.includes(w)));
    }

    // filter bus connections
    if (filters.byBus) {
      filteredWalkObjects = filteredWalkObjects.filter(walk => Object.keys(walk.busConnections ?? {}).length > 0)
    }

    setFilteredWalks(filteredWalkObjects);
  }, [filters, searchedWalkObjects])


  return (
    <div style={{zIndex: "9999"}}>
      <div className="walks__filter-search">
        <div
          className="walks__search-bar"
          onClick={() => searchRef.current?.focus()}
        >
          <SearchIcon />
          <input
            type="search"
            ref={searchRef}
            placeholder="Search for a walk"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm.length > 0 &&
            <button
              className="walks__search-bar-button"
              onClick={() => setSearchTerm("")}
              title="Clear text"
            >
              <CloseIconSmall />
            </button>
          }
        </div>
        <button
          className="walks__filter-button"
          onClick={() => setShowFilters(prev => !prev)}
          data-open={showFilters}
        >
          <span>Filters</span>
          {showFilters
            ? <CloseIcon />
            : <FilterIcon />
          }
        </button>
      </div>
      
      {showFilters &&
        <Filters
          filterData={Object.values(filterObjects)}
          className="walks__filters"
          closeSelf={() => setShowFilters(false)}
        />
      }
    </div>
  )
}
