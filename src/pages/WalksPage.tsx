import "./WalksPage.css";

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Walk } from "./WalkPage/WalkPage";
import { MapMarker, useWalkMarkers } from "../hooks/useMarkers";

import setPageTitle from "../hooks/setPageTitle";
import haversineDistance from "../utils/haversine";
import { getDistanceUnit, getDistanceValue, getElevationUnit, getElevationValue } from "../utils/unitConversions";
import { CheckboxFilter, FilterData, FilterGroup, Filters } from "../components/Filters";
import WalkCard from "../components/WalkCard";
import { useWalks } from "../contexts/WalksContext";
import { useHills } from "../contexts/HillsContext";
import { LakeMap } from "../components/map";
import BackToTopButton from "../components/BackToTopButton";
import { BusIconSmall, CloseIconSmall, DistanceIconSmall, ElevationIconSmall, FilterIcon, MountainIconSmall, SearchIcon, TownIconSmall } from "../components/Icons";


type WalkObject = {
  slug: string;
  walk: Walk;
  marker: MapMarker;
  dist?: number;
}


type Location = {
  slug: string;
  name: string;
  coords: [number, number];
  distScale?: number;
} | null
type Locations = {
  [name : string]: Location;
}

export const locations : Locations = {
  "keswick": {slug: "keswick", name: "Keswick", coords: [-3.1347, 54.6013]},
  "ambleside": {slug: "ambleside", name: "Ambleside", coords: [-2.9613, 54.4287]},
  "grasmere": {slug: "grasmere", name: "Grasmere", coords: [-3.0244, 54.4597]},
  "buttermere": {slug: "buttermere", name: "Buttermere", coords: [-3.2766, 54.5413]},
  "borrowdale": {slug: "borrowdale", name: "Borrowdale", coords: [-3.1486, 54.5028]},
  "coniston": {slug: "coniston", name: "Coniston", coords: [-3.0759, 54.3691], distScale: 1.5},
  "glenridding": {slug: "glenridding", name: "Glenridding", coords: [-2.9498, 54.5448]},
  "windermere": {slug: "windermere", name: "Windermere", coords: [-2.9068, 54.3807], distScale: 1.5},

  "dungeon-ghyll": {slug: "dungeon-ghyll", name: "Dungeon Ghyll", coords: [-3.0942, 54.4461]},
  "kentmere": {slug: "kentmere", name: "Kentmere", coords: [-2.8402, 54.4302], distScale: 1.25},
  "seatoller": {slug: "seatoller", name: "Seatoller", coords: [-3.1678, 54.5142]},
  "braithwaite": {slug: "braithwaite", name: "Braithwaite", coords: [-3.1923, 54.6026]},
  "wasdale": {slug: "wasdale", name: "Wasdale", coords: [-3.2966, 54.4660]},
  "thirlmere": {slug: "thirlmere", name: "Thirlmere", coords: [-3.0642, 54.5365]},
  "thornthwaite": {slug: "thornthwaite", name: "Thornthwaite", coords: [-3.2029, 54.6173]},
  "rosthwaite": {slug: "rosthwaite", name: "Rosthwaite", coords: [-3.1466, 54.5228]},
  "whinlatter-pass": {slug: "whinlatter-pass", name: "Whinlatter Pass", coords: [-3.2256, 54.6082]},
  "threlkeld": {slug: "threlkeld", name: "Threlkeld", coords: [-3.0543, 54.6190]},
  "dodd-wood": {slug: "dodd-wood", name: "Dodd Wood", coords: [-3.1868, 54.6428]},

  "penrith": {slug: "penrith", name: "Penrith", coords: [-2.7584, 54.6619], distScale: 2.5},
  "cockermouth": {slug: "cockermouth", name: "Cockermouth", coords: [-3.3647, 54.6623], distScale: 2},
  "kendal": {slug: "kendal", name: "Kendal", coords: [-2.7403, 54.3321], distScale: 2.5},
  "stavely": {slug: "stavely", name: "Stavely", coords: [-2.8184, 54.3756], distScale: 1.75},
  "oxenholme": {slug: "oxenholme", name: "Oxenholme", coords: [-2.7216, 54.3048], distScale: 2.75},
  "bassenthwaite": {slug: "bassenthwaite", name: "Bassenthwaite", coords: [-3.1953, 54.6795]},
}

const walkDelimiters = [0, 8, 16, 24];
const walkDistances = Object.fromEntries(walkDelimiters.map((k, i) => (i + 1 < walkDelimiters.length) ? [k + "-" + walkDelimiters[i+1], [k, walkDelimiters[i+1]]] : [k+"+", [k]]));
const distanceOptions = {
  "any": "Any",
  ...Object.fromEntries(Object.entries(walkDistances).map(([k, v]) =>
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


export default function WalksPage() {

  useEffect(() => {
    setPageTitle("Lake District Walks");
  }, [])

  const [locationParam, setLocationParam] = useState<Location | null>(null);
  const [locationSelectEntries, setLocationSelectEntries] = useState<string[]>(["keswick", "ambleside", "grasmere", "buttermere", "borrowdale", "coniston", "glenridding", "windermere"]);
  const [searchParams, setURLSearchParams] = useSearchParams();

  const [hoveredSlug, setHoveredSlug] = useState<string|null>(null);

  const setSearchParams = (searchParams?: URLSearchParams) => {
    setURLSearchParams(searchParams ?? {}, { replace: true })
  }

  const [distanceFilter, setDistanceFilter] = useState("any");
  const [elevationFilter, setElevationFilter] = useState("any");
  const [wainFiltered, setWainFiltered] = useState<string[]>([]);
  const [accessibleByBus, setAccessibleByBus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")

  const setLocationName = (name: string) => {
    if (name in locations) {
      searchParams.set("town", name);
      setSearchParams(searchParams);
    }
    else {
      searchParams.delete("town");
      setSearchParams(searchParams);
    }
  }

  const setWainwrightSlugs = (wainwrights: string[]) => {
    if (wainwrights.length > 0) {
      searchParams.set("wainwrights", wainwrights.join(","));
      setSearchParams(searchParams);
    }
    else {
      searchParams.delete("wainwrights");
      setSearchParams(searchParams);
    }
  }

  const setDistanceValue = (val: string) => {
    if (val != "any") {
      searchParams.set("distance", val);
      setSearchParams(searchParams);
    }
    else {
      searchParams.delete("distance");
      setSearchParams(searchParams);
    }
  }

  const setElevationValue = (val: string) => {
    if (val != "any") {
      searchParams.set("elevation", val);
      setSearchParams(searchParams);
    }
    else {
      searchParams.delete("elevation");
      setSearchParams(searchParams);
    }
  }

  const setAccessibleByBusBool = (val: boolean) => {
    if (val) {
      searchParams.set("by-bus", "true");
      setSearchParams(searchParams);
    }
    else {
      searchParams.delete("by-bus");
      setSearchParams(searchParams);
    }
  }


  useEffect(() => {
    // update town
    if (searchParams.has("town")) {
      let newNearTo = searchParams.get("town") ?? "";
      if (newNearTo in locations) {
        setLocationParam(locations[newNearTo]);

        if (!locationSelectEntries.includes(newNearTo)) {
          setLocationSelectEntries(prev => [...prev, newNearTo]);
        }
      }
      else {
        searchParams.delete("town");
      }
    }
    else setLocationParam(null);

    // update wainwrights
    setWainFiltered(searchParams.get("wainwrights")?.split(",") ?? []);

    // update length
    if (searchParams.has("distance")) {
      let newDistance = searchParams.get("distance") ?? "any";
      if (newDistance in distanceOptions) {
        setDistanceFilter(newDistance);
      }
      else {
        searchParams.delete("distance");
      }
    }
    else setDistanceFilter("any");

    // update elevation
    if (searchParams.has("elevation")) {
      let newDistance = searchParams.get("elevation") ?? "any";
      if (newDistance in elevationOptions) {
        setElevationFilter(newDistance);
      }
      else {
        searchParams.delete("elevation");
      }
    }
    else setElevationFilter("any");

    // update accessible by bus
    setAccessibleByBus(searchParams.get("by-bus") ? true : false)
  }, [searchParams])

  const walkData = useWalks().walks;
  const walkMarkers = Object.fromEntries(useWalkMarkers().map(marker => [marker.properties.slug, marker]));

  const maximumDist = 10;
  const walkObjects = useMemo(() => {
    if (!walkData || !walkMarkers) return [];

    let newWalkObjects = walkData.map(walk => ({
      slug: walk.slug,
      walk: walk,
      marker: walkMarkers[walk.slug]
    } as WalkObject));

    return newWalkObjects;
  }, [walkData])

  const locationsWalkObjects = useMemo(() => {
    if (locationParam) setPageTitle("Lake District Walks near " + locationParam?.name);
    else setPageTitle("Lake District Walks");

    
    if (locationParam) {
      let filteredWalkObjects = [...walkObjects];

      for (let walk of filteredWalkObjects) {
        walk.dist = haversineDistance([walk.walk.startLocation?.longitude ?? 0, walk.walk.startLocation?.latitude ?? 0], locationParam?.coords) / 1000;
      }

      let maxDist = maximumDist * (locationParam.distScale ?? 1);
      return filteredWalkObjects.filter(w => (w.dist ?? maxDist+1) < maxDist);
    }
    else return [...walkObjects];
  }, [locationParam, walkObjects])

  const [filteredWalks, filteredMarkers] = useMemo(() => {

    if (locationsWalkObjects) {
      let filteredWalkObjects = [...locationsWalkObjects];

      if (searchTerm) {
        filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.title.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      if (accessibleByBus) {
        filteredWalkObjects = filteredWalkObjects.filter(walk => Object.keys(walk.walk.busConnections ?? {}).length > 0);
      }

      if (distanceFilter != "any" && distanceFilter in walkDistances) {
        let minmax = walkDistances[distanceFilter] ?? [];
        if (minmax.length > 1) {
          filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.length && (walk.walk.length >= minmax[0] && walk.walk.length <= minmax[1]));
        }
        else if (minmax.length > 0) {
          filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.length && (walk.walk.length >= minmax[0]));
        }
      }

      if (elevationFilter != "any" && elevationFilter in elevationValues) {
        let minmax = elevationValues[elevationFilter] ?? [];
        if (minmax.length > 1) {
          filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.elevation && (walk.walk.elevation >= minmax[0] && walk.walk.elevation <= minmax[1]));
        }
        else if (minmax.length > 0) {
          filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.elevation && (walk.walk.elevation >= minmax[0]));
        }
      }

      if (wainFiltered.length > 0) {
        filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.wainwrights?.some(w => wainFiltered.includes(w)))
      }

      return [filteredWalkObjects.map(w => ({...w.walk, distance: w.dist})), filteredWalkObjects.map(w => w.marker)];
    }
    else return [[] as Walk[], [] as MapMarker[]]
  }, [locationsWalkObjects, accessibleByBus, distanceFilter, elevationFilter, wainFiltered, searchTerm])


  const [wainSearchTerm, setWainSearchTerm] = useState<string>("");
  const enabledWainwrights = useMemo(() => {
    return [...new Set(locationsWalkObjects.flatMap(walk => walk.walk.wainwrights ?? []).concat(wainFiltered))];
  }, [locationsWalkObjects, wainSearchTerm])


  const [sortValue, setSortValue] = useState("recommended");
  const sortedWalks = useMemo(() => {
    let newWalkData = [...filteredWalks];

    const [type, dir] = sortValue.split("-");
    switch (type) {
      case "closest":
        newWalkData.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999))
        break;
      case "recent":
        newWalkData.sort((a, b) => new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime());
        break;
      case "hills":
        newWalkData.sort((a, b) => (a.wainwrights?.length ?? 0) - (b.wainwrights?.length ?? 0));
        break;
      case "ele":
        newWalkData.sort((a, b) => (a.elevation ?? 0) - (b.elevation ?? 0));
        break;
      case "dist":
        newWalkData.sort((a, b) => (a.length ?? 0) - (b.length ?? 0));
        break;
      default:
        newWalkData.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    if (dir === "dsc") newWalkData.reverse();

    return newWalkData;
  }, [sortValue, filteredWalks])


  const townSelect : FilterData = {
    title: "Near to town",
    type: "select",
    data: {
      values: Object.fromEntries([["any", "Any"]].concat(locationSelectEntries.map(loc => [loc, locations[loc]?.name ?? ""]))),
      currentValue: locationParam?.slug ?? "any",
      setValue: setLocationName
    }
  }

  const hillsData = useHills().hills;
  const wainValues = useMemo(() => {
    if (!hillsData) return {}
    else return (
      Object.fromEntries(hillsData
        .filter(hill => hill.name.toLowerCase().indexOf(wainSearchTerm) >= 0)
        // .sort((a, b) => b.height - a.height)
        .sort((a, b) => a.name.toLowerCase().indexOf(wainSearchTerm) - b.name.toLowerCase().indexOf(wainSearchTerm))
        .map(hill => [hill.slug, hill.name]))
      )
  }, [hillsData])
  const wainChoose : FilterData = {
    title: "Wainwrights",
    type: "searchable-checkbox",
    data: {
      values: wainValues,
      enabledValues: enabledWainwrights,
      activeValues: wainFiltered,
      setActiveValues: setWainwrightSlugs,
      groupName: "fells"
    },
    placeholder: "filter fells",
    searchTerm: wainSearchTerm,
    setSearchTerm: setWainSearchTerm
  }

  const distRadios : FilterData = {
    title: "Walk length",
    type: "radio",
    data: {
      groupId: "distance",
      values: distanceOptions,
      currentValue: distanceFilter,
      setValue: setDistanceValue
    },
  }
  const eleRadios : FilterData = {
    title: "Elevation gain",
    type: "radio",
    data: {
      groupId: "elevation",
      values: elevationOptions,
      currentValue: elevationFilter,
      setValue: setElevationValue
    },
  }

  const filters : FilterData[] = [townSelect, wainChoose, distRadios, eleRadios];


  const resetFilters = useCallback(() => {
    // townSelect.data.setValue("any");
    // wainChoose.data.setActiveValues([]);
    // distRadios.data.setValue("any");
    // setAccessibleByBus(false);
    // setWainSearchTerm("");
    setSearchParams();
  }, [])

  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);


  return (
    <main className="walks-page">

      <BackToTopButton minHeight={300} />

      <section>
        <div className="flex-column">
          <h1 className="title">
            {locationParam
              ? <>Walks near {locationParam.name}</>
              : <>Walks in the Lake District</>
            }
          </h1>

          {/* <WalkMap
            mapMarkers={filteredMarkers}
            activePoint={hoveredSlug}
          /> */}

          <div className="walks__main">
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
              >
                <span>Filters</span>
                <FilterIcon />
              </button>
            </div>

            {showFilters &&
              <Filters
                className="walks__filters"
                title="Filter walks"
                filterData={filters}
                resetFilters={resetFilters}
              >
                <FilterGroup>
                  <CheckboxFilter
                    name="Accessible by bus"
                    checked={accessibleByBus}
                    onChange={e => setAccessibleByBusBool(e.target.checked)}
                  />
                </FilterGroup>
              </Filters>
            }

            <WalkGrid
              walks={sortedWalks}
              hasLocationParam={locationParam !== null}
              sortControl={{
                value: sortValue,
                set: setSortValue
              }}
              activeFilters={{
                town: locations[townSelect.data.currentValue]?.name,
                wainwrights: wainChoose.data.activeValues.map(slug => [slug, wainChoose.data.values[slug]]),
                distance: distRadios.data.currentValue !== "any" ? distRadios.data.values[distRadios.data.currentValue] : undefined,
                elevation: eleRadios.data.currentValue !== "any" ? eleRadios.data.values[eleRadios.data.currentValue] : undefined,
                byBus: accessibleByBus
              }}
              resetFilters={{
                town: () => townSelect.data.setValue("any"),
                wainwrights: (wain: string) => wainChoose.data.setActiveValues(wainChoose.data.activeValues.filter(w => w != wain)),
                distance: () => distRadios.data.setValue("any"),
                elevation: () => eleRadios.data.setValue("any"),
                byBus: () => setAccessibleByBusBool(false)
              }}
              setHoveredSlug={setHoveredSlug}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>
      </section>

    </main>
  )
}


type GridFilters = {
  town?: string,
  wainwrights?: [string, string][],
  distance?: string,
  elevation?: string,
  byBus?: boolean
}
type GridFilterResets = {
  town: CallableFunction,
  wainwrights: CallableFunction,
  distance: CallableFunction,
  elevation: CallableFunction,
  byBus: CallableFunction
}

function WalkGrid({ walks, hasLocationParam, sortControl, activeFilters, resetFilters, setHoveredSlug, searchTerm, setSearchTerm } : { walks: Walk[]; hasLocationParam?: boolean; sortControl: {value: string; set: CallableFunction}; activeFilters: GridFilters; resetFilters: GridFilterResets, setHoveredSlug?: CallableFunction, searchTerm: string, setSearchTerm: CallableFunction }) {

  useEffect(() => {
    if (hasLocationParam && sortControl.value === "recommended") sortControl.set("closest");
    else if (!hasLocationParam && sortControl.value === "closest") sortControl.set("recommended");
  }, [hasLocationParam])


  return (
    <div className="walks__grid">
      <div className="walks__grid-top">
        {/* <h2 className="heading">All walks</h2> */}
        <div>
          <ul className="walks__grid-filters-list">
            {activeFilters.town && <FilterTag reset={resetFilters.town} Icon={<TownIconSmall />} text={activeFilters.town} />}
            {activeFilters.wainwrights?.map((wain, index) => {
              return <FilterTag reset={() => resetFilters.wainwrights(wain[0])} key={index} Icon={<MountainIconSmall />} text={wain[1]} />
            })}
            {(activeFilters.distance && activeFilters.distance !== "any") && <FilterTag reset={resetFilters.distance} Icon={<DistanceIconSmall />} text={activeFilters.distance} />}
            {(activeFilters.elevation && activeFilters.elevation !== "any") && <FilterTag reset={resetFilters.elevation} Icon={<ElevationIconSmall />} text={activeFilters.elevation} />}
            {activeFilters.byBus && <FilterTag reset={resetFilters.byBus} Icon={<BusIconSmall />} text={"By Bus"} />}
          </ul>
        </div>
        <select
          value={sortControl.value}
          onChange={e => sortControl.set(e.target.value)}
        >
          <option value="recommended">Recommended</option>
          {hasLocationParam && <option value="closest">Closest</option>}
          <option value="hills-dsc">Most Wainwrights</option>
          <option value="hills-asc">Least Wainwrights</option>
          <option value="dist-dsc">Longest</option>
          <option value="dist-asc">Shortest</option>
          <option value="ele-dsc">Most Elevation</option>
          <option value="ele-asc">Least Elevation</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>

      {/* {(activeFilters || walks.length === 0) &&
        <div className="walks__grid-filters">
          {walks.length > 0
            ? <p>Showing <b>{walks.length + " walk" + (walks.length === 1 ? "" : "s")}</b> matching filters. <button className="button underlined" onClick={() => resetFilters()}>Reset filters</button></p>
            : <p>No walks match the current filters. <button className="button underlined" onClick={() => resetFilters()}>Reset filters</button></p>
          }
        </div>
      } */}

      <div className="walks__grid-grid">
        {walks.map((walk, index) => {
          return <WalkCard key={index}
                    walk={walk}
                    showDistance={hasLocationParam}
                    hoverEvent={setHoveredSlug}
                 />
        })}
      </div>

      {walks.length > 0 &&
        <p className="walks__grid-end-text">
          {activeFilters
            ? <>Showing {walks.length} walks matching filters. </>
            : <>Showing all {walks.length} walks. </>
          }
          <button
            onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
            title="Scroll to top"
          >
            Back to top
          </button>.
        </p>
      }
    </div>
  )
}


function FilterTag({ reset, Icon, text } : { reset: CallableFunction; Icon: ReactNode; text: string }) {
  
  return (
    <li>
      <button onClick={() => reset()} title="Remove filter">
        <CloseIconSmall />
      </button>
      {Icon}
      {text}
    </li>
  )
}


function WalkMap({mapMarkers, activePoint} : {mapMarkers: MapMarker[], activePoint: string | null}) {

  const [open, setOpen] = useState(false);


  return (
    <div className="walks__map" data-open={open}>
      <LakeMap
        mapMarkers={open ? mapMarkers: []}
        activePoint={activePoint}
      />

      <button
        className="button primary round small walks__map-button"
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? "Close map" : "Open map"}
      </button>
    </div>
  )
}
