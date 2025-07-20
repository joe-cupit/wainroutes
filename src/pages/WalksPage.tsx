import "./WalksPage.css";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Walk } from "./WalkPage/WalkPage";
import { MapMarker } from "../hooks/useMarkers";

import setPageTitle from "../hooks/setPageTitle";
import WalkCard from "../components/WalkCard";
import { LakeMap } from "../components/map";
import BackToTopButton from "../components/BackToTopButton";
import { BusIconSmall, CloseIconSmall, DistanceIconSmall, ElevationIconSmall, FilterIcon, MountainIconSmall, SearchIcon, TownIconSmall } from "../components/Icons";
import WalksSearchBar from "../components/WalksSearchBar";


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


export default function WalksPage() {

  useEffect(() => {
    setPageTitle("Lake District Walks");
  }, [])

  const [searchParams, setURLSearchParams] = useSearchParams();
  const [filteredWalks, setFilteredWalks] = useState<Walk[]>([]);

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
        // newWalkData.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    if (dir === "dsc") newWalkData.reverse();

    return newWalkData;
  }, [sortValue, filteredWalks])


  return (
    <main className="walks-page">

      <BackToTopButton minHeight={300} />

      <section>
        <div className="flex-column">
          <h1 className="title">
            {(searchParams.get("town") ?? "") in locations
              ? <>Walks near {locations[searchParams.get("town") ?? ""]?.name}</>
              : <>Walks in the Lake District</>
            }
          </h1>

          {/* <WalkMap
            mapMarkers={filteredMarkers}
            activePoint={hoveredSlug}
          /> */}

          <div className="walks__main">
            <WalksSearchBar setFilteredWalks={setFilteredWalks} />

            <WalkGrid
              walks={sortedWalks}
              hasLocationParam={searchParams.has("town") !== null}
              sortControl={{
                value: sortValue,
                set: setSortValue
              }}
              activeFilters={{
                // town: locations[townSelect.data.currentValue]?.name,
                // wainwrights: wainChoose.data.activeValues.map(slug => [slug, wainChoose.data.values[slug]]),
                // distance: distRadios.data.currentValue !== "any" ? distRadios.data.values[distRadios.data.currentValue] : undefined,
                // elevation: eleRadios.data.currentValue !== "any" ? eleRadios.data.values[eleRadios.data.currentValue] : undefined,
                // byBus: accessibleByBus
              }}
              resetFilters={{
                // town: () => townSelect.data.setValue("any"),
                // wainwrights: (wain: string) => wainChoose.data.setActiveValues(wainChoose.data.activeValues.filter(w => w != wain)),
                // distance: () => distRadios.data.setValue("any"),
                // elevation: () => eleRadios.data.setValue("any"),
                // byBus: () => setAccessibleByBusBool(false)
              }}
              // setHoveredSlug={setHoveredSlug}
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

function WalkGrid({ walks, hasLocationParam, sortControl, activeFilters, resetFilters, setHoveredSlug } : { walks: Walk[]; hasLocationParam?: boolean; sortControl: {value: string; set: CallableFunction}; activeFilters: GridFilters; resetFilters: GridFilterResets, setHoveredSlug?: CallableFunction }) {

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

      {(walks.length === 0) &&
        <div className="walks__grid-filters">
          <>No walks match the current filters. <button className="button underlined">Reset filters</button></>
          {/* {walks.length > 0
            ? <>Showing <b>{walks.length + " walk" + (walks.length === 1 ? "" : "s")}</b> matching filters. <button className="button underlined" onClick={() => resetFilters()}>Reset filters</button></>
            : <>No walks match the current filters. <button className="button underlined" onClick={() => resetFilters()}>Reset filters</button></>
          } */}
        </div>
      }

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
