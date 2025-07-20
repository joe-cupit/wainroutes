import { useEffect, useMemo, useRef, useState } from "react";

import { FilterData, Filters } from "./Filters";
import { CloseIconSmall, FilterIcon, SearchIcon } from "./Icons";
import Fuse from "fuse.js";
import { Walk } from "../pages/WalkPage/WalkPage";
import { useWalks } from "../contexts/WalksContext";
import { MapMarker } from "../hooks/useMarkers";
import { useHills } from "../contexts/HillsContext";
import { useSearchParams } from "react-router-dom";
import { getDistanceUnit, getDistanceValue, getElevationUnit, getElevationValue } from "../utils/unitConversions";
import { locations } from "../pages/WalksPage";
import haversineDistance from "../utils/haversine";


export type WalkObject = {
  slug: string;
  walk: Walk;
  marker: MapMarker;
  dist?: number;
  score: number;
}

type FilterState = {
  town: string,
  distance: string,
  elevation: string,
  wainwrights: string[],
  byBus: boolean
}
const initialFilterState : FilterState = {
  town: "any",
  distance: "any",
  elevation: "any",
  wainwrights: [],
  byBus: false
}


export default function WalksSearchBar({ setFilteredWalks } : { setFilteredWalks: CallableFunction }) {
  
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
  
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [showFilters, setShowFilters] = useState(false);

  const walkData : Walk[] = useMemo(() => {
    let newWalkData = useWalks().walks ?? [];

    if (filters.town in locations) {
      const centerLoc = locations[filters.town];
      if (centerLoc) {
        for (let walk of newWalkData) {
          walk.distance = haversineDistance(centerLoc.coords, [walk.startLocation?.longitude ?? 0, walk.startLocation?.latitude ?? 0]) / 1000;
        }
        newWalkData = newWalkData.filter(walk => walk.distance! < 10 * (centerLoc.distScale ?? 1))
      }
    }

    return newWalkData;
  }, [filters.town]);

  const searchableWalks = useMemo(() => {
    if (!walkData) return;

    return new Fuse(walkData, {
      keys: ["title", "wainwrights", "startLocation.location", "tags"],
      threshold: 0.25,
      includeScore: true
    })
  }, [walkData, filters.town])

  const searchedWalkObjects : {walk: Walk, score: number}[] = useMemo(() => {
    if (!searchableWalks || !walkData) return [];
    if (!debouncedSearchTerm) {
      urlSearchParams.delete("query");
      setUrlSearchParams(urlSearchParams);
      return walkData?.map(walk => ({walk: walk, score: 0}));
    }
    else {
      urlSearchParams.set("query", debouncedSearchTerm);
      setUrlSearchParams(urlSearchParams);
      return searchableWalks.search(debouncedSearchTerm).map(res => ({walk: res.item, score: (res.score ?? 0)}));
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
    <div>
      <div className="walks__filter-search">
        <div
          className="walks__search-bar"
          onClick={() => searchRef.current?.focus()}
        >
          <SearchIcon />
          <input
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
          <FilterIcon />
        </button>
      </div>
      
      <WalksSearchFilters
        filters={filters}
        setFilters={setFilters}
        isOpen={showFilters}
        closeSelf={() => setShowFilters(false)}
      />
    </div>
  )
}


const distanceDelimiters = [0, 6, 12, 18];
const distanceValues = Object.fromEntries(distanceDelimiters.map((k, i) => (i + 1 < distanceDelimiters.length) ? [k + "-" + distanceDelimiters[i+1], [k, distanceDelimiters[i+1]]] : [k+"+", [k]]));
const distanceOptions = {
  "any": "Any",
  ...Object.fromEntries(Object.entries(distanceValues).map(([k, v]) =>
    [k, (v[0] == 0
        ? "<"+getDistanceValue(v[1], 0)
        : getDistanceValue(v[0], 0) + (v.length > 1 ? "-"+getDistanceValue(v[1], 0) : "")
        ) + getDistanceUnit() + (v.length == 1 ? "+" : "")
    ]
  ))
}
const roundNearest100 = (n: number) => {
  return Math.round(n / 100) * 100
}
const elevationDelimiters = [0, 300, 600, 900];
const elevationValues = Object.fromEntries(elevationDelimiters.map((k, i) => (i + 1 < elevationDelimiters.length) ? [k + "-" + elevationDelimiters[i+1], [k, elevationDelimiters[i+1]]] : [k+"+", [k]]));
const elevationOptions = {
  "any": "Any",
  ...Object.fromEntries(Object.entries(elevationValues).map(([k, v]) =>
    [k, (v[0] == 0
        ? "<"+roundNearest100(getElevationValue(v[1])!)
        : roundNearest100(getElevationValue(v[0])!) + (v.length > 1 ? "-"+roundNearest100(getElevationValue(v[1])!) : "")
        ) + getElevationUnit() + (v.length == 1 ? "+" : "")
    ]
  ))
}


function WalksSearchFilters({ filters, setFilters, isOpen, closeSelf } : { filters: FilterState; setFilters: React.Dispatch<React.SetStateAction<FilterState>>; isOpen: boolean; closeSelf: CallableFunction }) {

  // const [filters, setFilters] = useState(initialFilterState);
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const replaceSearchParams = (searchParams?: URLSearchParams) => {
    console.log(searchParams)
    setUrlSearchParams(searchParams ?? {}, { replace: true })
  }

  useEffect(() => {
    const params = Object.fromEntries(urlSearchParams.entries());
    let newFilters = {...initialFilterState} as FilterState;

    // update town
    if (params.town && params.town in locations) {
      if (!locationSelectEntries.includes(params.town)) {
        setLocationSelectEntries(prev => [...prev, params.town]);
      }
      newFilters.town = params.town;
    }

    // update wainwrights
    newFilters.wainwrights = params.wainwrights?.split(" ") ?? [];

    // update distance
    if (params.distance && params.distance in distanceOptions) {
      newFilters.distance = params.distance;
    }

    // update elevation
    if (params.elevation && params.elevation in elevationOptions) {
      newFilters.elevation = params.elevation;
    }

    // update accessible by bus
    newFilters.byBus = (params.byBus === "yes");

    console.log(newFilters);
    setFilters(newFilters);
  }, [urlSearchParams])

  // useEffect(() => {
  //   let params = Object.fromEntries(urlSearchParams.entries());

  //   if (filters.town !== "any") params.town = filters.town;
  //   else delete params.town;

  //   if (filters.distance !== "any") params.distance = filters.distance;
  //   else delete params.distance;

  //   if (filters.elevation !== "any") params.elevation = filters.elevation;
  //   else delete params.elevation;

  //   if (filters.wainwrights.length > 0) params.wainwrights = filters.wainwrights.join(",");
  //   else delete params.wainwrights;

  //   if (filters.byBus) params.byBus = "yes";
  //   else delete params.byBus;

  //   console.log(params)
  //   setUrlSearchParams(params);
  // }, [filters])


  const [locationSelectEntries, setLocationSelectEntries] = useState<string[]>(["keswick", "ambleside", "grasmere", "buttermere", "borrowdale", "coniston", "glenridding", "windermere"]);
  const townSelect : FilterData = {
    title: "Near to town",
    type: "select",
    data: {
      groupId: "town",
      values: Object.fromEntries([["any", "Any"]].concat(locationSelectEntries.map(loc => [loc, locations[loc]?.name ?? ""]))),
      currentValue: filters.town,
      setValue: (newTown: string) => {
        if (newTown === "any") urlSearchParams.delete("town");
        else urlSearchParams.set("town", newTown);

        replaceSearchParams(urlSearchParams);
      }
    }
  }

  const hillsData = useHills().hills;
  const wainValues = useMemo(() => {
    if (hillsData) return Object.fromEntries(hillsData.map(hill => [hill.slug, hill.name]));
    else return {};
  }, [hillsData])
  const wainChoose : FilterData = {
    title: "Wainwrights",
    type: "searchable-checkbox",
    data: {
      values: wainValues,
      enabledValues: Object.keys(wainValues),
      activeValues: filters.wainwrights,
      setActiveValues: (newWainwrights: string[]) => {
        if (newWainwrights.length > 0) urlSearchParams.set("wainwrights", newWainwrights.join(" "));
        else urlSearchParams.delete("wainwrights");

        replaceSearchParams(urlSearchParams);
      },
      groupName: "fells"
    },
    placeholder: "filter fells",
    searchTerm: "",
    setSearchTerm: () => {}
  }

  const distRadios : FilterData = {
    title: "Walk length",
    type: "radio",
    data: {
      groupId: "distance",
      values: distanceOptions,
      currentValue: filters.distance,
      setValue: (newDist: string) => {
        if (newDist === "any") urlSearchParams.delete("distance");
        else urlSearchParams.set("distance", newDist);

        replaceSearchParams(urlSearchParams);
      }
    },
  }
  const eleRadios : FilterData = {
    title: "Elevation gain",
    type: "radio",
    data: {
      groupId: "elevation",
      values: elevationOptions,
      currentValue: filters.elevation,
      setValue: (newEle: string) => {
        if (newEle === "any") urlSearchParams.delete("elevation");
        else urlSearchParams.set("elevation", newEle);

        replaceSearchParams(urlSearchParams);
      }
    },
  }
  const transportRadios : FilterData = {
    title: "Transport access",
    type: "radio",
    data: {
      groupId: "by-bus",
      values: {
        "any": "Any",
        "byBus": "By bus"
      },
      currentValue: filters.byBus ? "byBus" : "any",
      setValue: (val: string) => {
        if (val === "byBus") urlSearchParams.set("byBus", "yes");
        else urlSearchParams.delete("byBus");

        replaceSearchParams(urlSearchParams);
      }
    },
  }

  const filterObjects : FilterData[] = [townSelect, distRadios, eleRadios, wainChoose, transportRadios];


  if (isOpen) return (
    <Filters
      className="walks__filters"
      filterData={filterObjects}
      resetFilters={() => setFilters(initialFilterState)}
      closeSelf={closeSelf}
    />
  )
  else return <></>
}
