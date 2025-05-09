import "./WalksPage.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Walk } from "./WalkPage/WalkPage";
import { MapMarker, useWalkMarkers } from "../hooks/useMarkers";

import setPageTitle from "../hooks/setPageTitle";
import Image from "../components/Image";
import { useWalks } from "../hooks/useWalks";
import haversineDistance from "../utils/haversine";
import { displayDistance, displayElevation } from "../utils/unitConversions";
import { ElevationIcon, HikingIcon, MountainIcon } from "../components/Icons";
import { CheckboxFilter, CheckboxFilterGroup, FilterGroup, RadioFilterGroup, SearchBoxFilter, SelectFilter } from "../components/Filters";


type WalkObject = {
  slug: string;
  walk: Walk;
  marker: MapMarker;
  dist?: number;
}


type Location = {
  name: string;
  coords: [number, number];
} | null
type Locations = {
  [name : string]: Location;
}

const locations : Locations = {
  "keswick": {name: "Keswick", coords: [-3.1347, 54.6013]},
  "ambleside": {name: "Ambleside", coords: [-2.9613, 54.4287]},
  "grasmere": {name: "Grasmere", coords: [-3.0244, 54.4597]},
  "buttermere": {name: "Buttermere", coords: [-3.2766, 54.5413]},
  "borrowdale": {name: "Borrowdale", coords: [-3.1486, 54.5028]},
  "coniston": {name: "Coniston", coords: [-3.0759, 54.3691]},
  "glenridding": {name: "Glenridding", coords: [-2.9498, 54.5448]},
  "windermere": {name: "Windermere", coords: [-2.9068, 54.3807]},

  // "dungeon-ghyll": {name: "Dungeon Ghyll", coords: [-3.0942, 54.4461]},
  // "kentmere": {name: "Kentmere", coords: [-2.8402, 54.4302]},
  // "seatoller": {name: "Seatoller", coords: [-3.1678, 54.5142]},
  // "braithwaite": {name: "Braithwaite", coords: [-3.1923, 54.6026]},
  // "wasdale": {name: "Wasdale", coords: [-3.2966, 54.4660]},
  // "thirlmere": {name: "Thirlmere", coords: [-3.0642, 54.5365]},
  // "thornthwaite": {name: "Thornthwaite", coords: [-3.2029, 54.6173]},
  // "rosthwaite": {name: "Rosthwaite", coords: [-3.1466, 54.5228]},
  // "whinlatter-pass": {name: "Whinlatter Pass", coords: [-3.2256, 54.6082]},
  // "threlkeld": {name: "Threlkeld", coords: [-3.0543, 54.6190]},
  // "dodd-wood": {name: "Dodd Wood", coords: [-3.1868, 54.6428]},
}


export default function WalksPage() {

  useEffect(() => {
    setPageTitle("Lake District Walks");
  }, [])

  const [locationParam, setLocationParam] = useState<Location>();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.has("nearto")) {
      let nearto = (searchParams.get("nearto") ?? "").toLowerCase();
      if (nearto in locations) {
        setLocationParam(locations[nearto]);
      }
      else {
        searchParams.delete("nearto");
        setSearchParams(searchParams);
      }
    }
    else {
      setLocationParam(null);
    }
  }, [searchParams])

  
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

  const [filteredWalks, filteredMarkers] = useMemo(() => {
    if (locationParam) {
      setPageTitle("Lake District Walks in " + locationParam?.name);

      if (walkObjects) {
        for (let walk of walkObjects) {
          walk.dist = haversineDistance([walk.walk.startLocation?.longitude ?? 0, walk.walk.startLocation?.latitude ?? 0], locationParam?.coords) / 1000;
        }
      }
    }
    else setPageTitle("Lake District Walks");

    if (walkObjects) {
      let filteredWalkObjects = [...walkObjects];
      if (locationParam) {
        filteredWalkObjects = filteredWalkObjects.filter(w => (w.dist ?? maximumDist+1) < maximumDist);
      }
      
      return [filteredWalkObjects.map(w => ({...w.walk, distance: w.dist})), filteredWalkObjects.map(w => w.marker)];
    }
    else return [[] as Walk[], [] as MapMarker[]]
  }, [locationParam, walkObjects])

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


  return (
    <main className="walks-page">

      <section>
        <div className="flex-column">
          <h1 className="title">Walks in the Lake District</h1>

          <div className="walks__main">
            <Filters />
            <WalkGrid
              walks={sortedWalks}
              sortControl={{
                value: sortValue,
                set: setSortValue
              }}
            />
          </div>
        </div>
      </section>

    </main>
  )
}


function WalkGrid({ walks, sortControl } : { walks: Walk[]; sortControl: {value: string; set: CallableFunction} }) {
  return (
    <div className="walks__grid">
      <div className="flex-row justify-apart align-center">
        <h2 className="heading">All walks</h2>
        <select
          value={sortControl.value}
          onChange={e => sortControl.set(e.target.value)}
        >
          <option value="recommended">Recommended</option>
          <option value="hills-dsc">Most Wainwrights</option>
          <option value="hills-asc">Least Wainwrights</option>
          <option value="dist-dsc">Longest</option>
          <option value="dist-asc">Shortest</option>
          <option value="ele-dsc">Most Elevation</option>
          <option value="ele-asc">Least Elevation</option>
        </select>
      </div>

      <div className="walks__grid-grid">
        {walks.map((walk, index) => {
          return <WalkCard key={index} walk={walk} />
        })}
      </div>
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


function Filters() {
  return (
    <div className="walks__filters">
      <h2 className="subheading">Filter walks</h2>

      <FilterGroup title="Near to town">
        <SelectFilter
          defaultValue="any"
          optionData={Object.fromEntries([["any", "Any"]].concat(Object.keys(locations).map(loc => [loc, locations[loc]?.name ?? ""])))}
        />
      </FilterGroup>

      <FilterGroup title="Wainwrights">
        <SearchBoxFilter placeholder="find a wainwright" />
        <CheckboxFilterGroup>
          <CheckboxFilter name="Helvellyn" />
          <CheckboxFilter name="Scafell Pike" />
          <CheckboxFilter name="Fairfield" />
          <CheckboxFilter name="Skiddaw" />
          <button>view all...</button>
        </CheckboxFilterGroup>
      </FilterGroup>

      <FilterGroup title="Distance">
        <RadioFilterGroup
          groupId="distance"
          names={["Any", "<5km", "5-10km", "10-20km", ">20km"]}
        />
      </FilterGroup>
    </div>
  )
}
