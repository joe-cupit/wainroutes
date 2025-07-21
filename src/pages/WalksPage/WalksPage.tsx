import "./WalksPage.css";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Walk } from "../WalkPage/WalkPage";
import setPageTitle from "../../hooks/setPageTitle";
import { MapMarker } from "../../hooks/useMarkers";
import { LakeMap } from "../../components/map";
import BackToTopButton from "../../components/BackToTopButton";

import WalksSearchBar from "./components/WalksSearchBar";
import WalkGrid from "./components/WalkGrid";
import { FiltersProvider, useFilters } from "./contexts/FilterContext";
import { locations } from "./utils/FilterValues";


export default function WalksPage() {

  useEffect(() => {
    setPageTitle("Lake District Walks");
  }, [])


  return (
    <FiltersProvider>
      <main className="walks-page">

        <BackToTopButton minHeight={300} />
        <WalksPageMain />

      </main>
    </FiltersProvider>
  )
}


function WalksPageMain() {

  const { town: currentTown } = useFilters().filters;
  const [filteredWalks, setFilteredWalks] = useState<Walk[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [sortValue, setSortValue] = useState("recommended");

  const updateSortSearchParam = (newSort?: string) => {
    if (newSort && newSort !== "recommended") {
      searchParams.set("sort", newSort);
    }
    else searchParams.delete("sort");

    setSearchParams(searchParams);
  }
  useEffect(() => {
    setSortValue(searchParams.get("sort") ?? "recommended")
  }, [searchParams.get("sort")])

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
    <section>
      <div className="flex-column">
        <h1 className="title">
          {locations[currentTown]
            ? <>Walks near {locations[currentTown].name}</>
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
            hasLocationParam={(currentTown in locations)}
            sortControl={{
              value: sortValue,
              set: updateSortSearchParam
            }}
          />
        </div>
      </div>
    </section>
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
