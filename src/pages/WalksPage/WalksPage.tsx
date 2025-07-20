import "./WalksPage.css";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Walk } from "../WalkPage/WalkPage";
import { MapMarker } from "../../hooks/useMarkers";

import setPageTitle from "../../hooks/setPageTitle";
import { LakeMap } from "../../components/map";
import BackToTopButton from "../../components/BackToTopButton";
import WalksSearchBar from "./components/WalksSearchBar";
import { FiltersProvider } from "./contexts/FilterContext";
import WalkGrid from "./components/WalkGrid";
import { locations } from "./utils/FilterValues";


export default function WalksPage() {

  // TODO: create a filter context here for all child elements probably
  // then change anywhere in this file where it uses the search params probably
  // move default definitions and that here i suppose

  // maybe even store sorted by in search params

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
    <FiltersProvider>
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
              />
            </div>
          </div>
        </section>

      </main>
    </FiltersProvider>
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
