import "./WalksPage.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Walk } from "./WalkPage/WalkPage";
import { MapMarker, useWalkMarkers } from "../hooks/useMarkers";

import setPageTitle from "../hooks/setPageTitle";
import Image from "../components/Image";
import { useWalks } from "../hooks/useWalks";
import haversineDistance from "../utils/haversine";
import { displayDistance, displayElevation, getDistanceUnit, getDistanceValue } from "../utils/unitConversions";
import { ElevationIcon, HikingIcon, MountainIcon } from "../components/Icons";
import { CheckboxFilterGroup, FilterData, FilterGroup, Filters, RadioFilterGroup, SearchBoxFilter, SelectFilter } from "../components/Filters";
import { useHills } from "../hooks/useHills";
import { Hill } from "./HillPage";


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
} | null
type Locations = {
  [name : string]: Location;
}

const locations : Locations = {
  "keswick": {slug: "keswick", name: "Keswick", coords: [-3.1347, 54.6013]},
  "ambleside": {slug: "ambleside", name: "Ambleside", coords: [-2.9613, 54.4287]},
  "grasmere": {slug: "grasmere", name: "Grasmere", coords: [-3.0244, 54.4597]},
  "buttermere": {slug: "buttermere", name: "Buttermere", coords: [-3.2766, 54.5413]},
  "borrowdale": {slug: "borrowdale", name: "Borrowdale", coords: [-3.1486, 54.5028]},
  "coniston": {slug: "coniston", name: "Coniston", coords: [-3.0759, 54.3691]},
  "glenridding": {slug: "glenridding", name: "Glenridding", coords: [-2.9498, 54.5448]},
  "windermere": {slug: "windermere", name: "Windermere", coords: [-2.9068, 54.3807]},

  "dungeon-ghyll": {slug: "dungeon-ghyll", name: "Dungeon Ghyll", coords: [-3.0942, 54.4461]},
  "kentmere": {slug: "kentmere", name: "Kentmere", coords: [-2.8402, 54.4302]},
  "seatoller": {slug: "seatoller", name: "Seatoller", coords: [-3.1678, 54.5142]},
  "braithwaite": {slug: "braithwaite", name: "Braithwaite", coords: [-3.1923, 54.6026]},
  "wasdale": {slug: "wasdale", name: "Wasdale", coords: [-3.2966, 54.4660]},
  "thirlmere": {slug: "thirlmere", name: "Thirlmere", coords: [-3.0642, 54.5365]},
  "thornthwaite": {slug: "thornthwaite", name: "Thornthwaite", coords: [-3.2029, 54.6173]},
  "rosthwaite": {slug: "rosthwaite", name: "Rosthwaite", coords: [-3.1466, 54.5228]},
  "whinlatter-pass": {slug: "whinlatter-pass", name: "Whinlatter Pass", coords: [-3.2256, 54.6082]},
  "threlkeld": {slug: "threlkeld", name: "Threlkeld", coords: [-3.0543, 54.6190]},
  "dodd-wood": {slug: "dodd-wood", name: "Dodd Wood", coords: [-3.1868, 54.6428]},
}


export default function WalksPage() {

  useEffect(() => {
    setPageTitle("Lake District Walks");
  }, [])

  const [locationParam, setLocationParam] = useState<Location | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const setLocationName = (name: string) => {
    if (name in locations) {
      setLocationParam(locations[name]);
      searchParams.set("nearto", name);
      setSearchParams(searchParams);
    }
    else {
      searchParams.delete("nearto");
      setSearchParams(searchParams);
      setLocationParam(null)
    }
  }


  const maximumDist = 8;
  const walkObjects = useMemo(() => {
    const walkData = useWalks() as {[slug : string]: Walk};
    const walkMarkers = Object.fromEntries(useWalkMarkers().map(marker => [marker.properties.slug, marker]));

    let newWalkObjects = Object.keys(walkData).map(slug => ({
      slug: slug,
      walk: walkData[slug],
      marker: walkMarkers[slug]
    } as WalkObject));

    return newWalkObjects;
  }, [])

  const [distanceFilter, setDistanceFilter] = useState("any");
  const [wainFiltered, setWainFiltered] = useState<string[]>([]);

  const [filteredWalks, filteredMarkers] = useMemo(() => {
    if (locationParam) setPageTitle("Lake District Walks in " + locationParam?.name);
    else setPageTitle("Lake District Walks");

    if (walkObjects) {
      let filteredWalkObjects = [...walkObjects];

      switch (distanceFilter) {
        case "<5":
          filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.length && (walk.walk.length <= 5));
          break;
        case "5-10":
          filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.length && (walk.walk.length >= 5 && walk.walk.length <= 10));
          break;
        case "10-20":
          filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.length && (walk.walk.length >= 10 && walk.walk.length <= 20));
          break;
        case ">20":
          filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.length && (walk.walk.length >= 20));
          break;
        default:
          break;
      }

      if (wainFiltered.length > 0) {
        filteredWalkObjects = filteredWalkObjects.filter(walk => walk.walk.wainwrights?.some(w => wainFiltered.includes(w)))
      }

      if (locationParam) {
        for (let walk of walkObjects) {
          walk.dist = haversineDistance([walk.walk.startLocation?.longitude ?? 0, walk.walk.startLocation?.latitude ?? 0], locationParam?.coords) / 1000;
        }

        filteredWalkObjects = filteredWalkObjects.filter(w => (w.dist ?? maximumDist+1) < maximumDist);
      }

      return [filteredWalkObjects.map(w => ({...w.walk, distance: w.dist})), filteredWalkObjects.map(w => w.marker)];
    }
    else return [[] as Walk[], [] as MapMarker[]]
  }, [locationParam, walkObjects, distanceFilter, wainFiltered])

  const [sortValue, setSortValue] = useState("recommended");
  const sortedWalks = useMemo(() => {
    let newWalkData = [...filteredWalks];
    if (sortValue === "recommended") return newWalkData;

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
        break;
    }

    if (dir === "dsc") newWalkData.reverse();

    return newWalkData;
  }, [sortValue, filteredWalks])


  const townSelect : FilterData = {
    title: "Near to town",
    type: "select",
    data: {
      values: Object.fromEntries([["any", "Any"]].concat(["keswick", "ambleside", "grasmere", "buttermere", "borrowdale", "coniston", "glenridding", "windermere"].map(loc => [loc, locations[loc]?.name ?? ""]))),
      currentValue: locationParam?.slug ?? "any",
      setValue: setLocationName
    }
  }

  const [searchTerm, setSearchTerm] = useState<string>("");
  const wainChoose : FilterData = {
    title: "Wainwrights",
    type: "searchable-checkbox",
    data: {
      values: Object.fromEntries(
                Object.values(useHills() as {[slug: string]: Hill})
                  .filter(hill => hill.hasWalk)
                  .filter(hill => hill.name.toLowerCase().indexOf(searchTerm) >= 0)
                  // .sort((a, b) => b.height - a.height)
                  .sort((a, b) => a.name.toLowerCase().indexOf(searchTerm) - b.name.toLowerCase().indexOf(searchTerm))
                  .map(hill => [hill.slug, hill.name])
              ),
      activeValues: wainFiltered,
      setActiveValues: setWainFiltered,
    },
    placeholder: "filter fells",
    searchTerm: searchTerm,
    setSearchTerm: setSearchTerm
  }

  const distRadios : FilterData = {
    title: "Distance",
    type: "radio",
    data: {
      groupId: "distance",
      values: {
        "any": "Any",
        "<5": "<"+getDistanceValue(5, 0)+getDistanceUnit(),
        "5-10": getDistanceValue(5, 0)+"-"+getDistanceValue(10, 0)+getDistanceUnit(),
        "10-20": getDistanceValue(10, 0)+"-"+getDistanceValue(20, 0)+getDistanceUnit(),
        ">20": ">"+getDistanceValue(20, 0)+getDistanceUnit()
      },
      currentValue: distanceFilter,
      setValue: setDistanceFilter
    },
  }

  const filters : FilterData[] = [townSelect, wainChoose, distRadios];


  const resetFilters = useCallback(() => {
    townSelect.data.setValue("any");
    wainChoose.data.setActiveValues([]);
    distRadios.data.setValue("any");
  }, [])


  return (
    <main className="walks-page">

      <section>
        <div className="flex-column">
          <h1 className="title">
            {locationParam
              ? <>Walks in {locationParam.name}</>
              : <>Walks in the Lake District</>
            }
          </h1>

          <div className="walks__main">
            <Filters
              className="walks__filters"
              title="Filter walks"
              filterData={filters}
            />
            <WalkGrid
              walks={sortedWalks}
              hasLocationParam={locationParam !== null}
              sortControl={{
                value: sortValue,
                set: setSortValue
              }}
              resetFilters={resetFilters}
            />
          </div>
        </div>
      </section>

    </main>
  )
}


function WalkGrid({ walks, hasLocationParam, sortControl, resetFilters } : { walks: Walk[]; hasLocationParam?: boolean; sortControl: {value: string; set: CallableFunction}; resetFilters: CallableFunction }) {

  useEffect(() => {
    if (hasLocationParam && sortControl.value === "recommended") sortControl.set("closest");
    else if (!hasLocationParam && sortControl.value === "closest") sortControl.set("recommended");
  }, [hasLocationParam])


  return (
    <div className="walks__grid">
      <div className="flex-row justify-apart align-center">
        <h2 className="heading">All walks</h2>
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
        </select>
      </div>

      {walks.length > 0
        ? <div className="walks__grid-grid">
            {walks.map((walk, index) => {
              return <WalkCard key={index} walk={walk} />
            })}
          </div>
        : <p>No walks match your filters. <button className="button underlined" onClick={() => resetFilters()}>Reset filters</button></p>
      }
    </div>
  )
}


function WalkCard({ walk } : { walk: Walk }) {
  return (
    <article className="walks-card">
      <Image
        className="walks-card__image"
        name={walk?.slug + "_" + walk?.gallery?.coverId}
        sizes="(min-width: 22rem) 22rem, 100vw"
        maxWidth={512}
      />

      <div className="walks-card__text">
        <h3 className="subheading">{walk.title}</h3>
        <div className="walks-card__icons flex-row">
          <div className="flex-row gap-0 align-center">
            <HikingIcon />
            {displayDistance(walk.length, 1)}
          </div>
          <div className="flex-row gap-0 align-center">
            <ElevationIcon />
            {displayElevation(walk.elevation)}
          </div>
          <div className="flex-row gap-0 align-center">
            <MountainIcon />
            {walk.wainwrights?.length ?? "N/A"}
          </div>
        </div>

        <Link to={"/walks/"+walk.slug} className="button">View walk</Link>
      </div>
    </article>
  )
}
