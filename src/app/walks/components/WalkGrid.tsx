"use client";

import styles from "../Walks.module.css";
import buttonStyles from "@/app/buttons.module.css";

import { useEffect, useMemo, useState } from "react";

import type { SimpleWalk } from "../page";
import WalkCard from "@/components/WalkCard/WalkCard";
import { BusIcon, CloseIconSmall, ElevationIcon, HikingIcon, LocationIcon, MountainIcon } from "@/icons/WalkIcons";
import { useSearchParams } from "next/navigation";
import { distanceOptions, elevationOptions, locations } from "./WalkFilterValues";


type WalkGridProps = {
  walks: SimpleWalk[];
  wainNames: {[slug : string]: string};
  resetFilters: CallableFunction;
  showDistances: boolean;
}


export default function WalkGrid({ walks, wainNames, resetFilters, showDistances } : WalkGridProps) {
  const [sortValue, setSortValue] = useState("recommended");

  useEffect(() => {
    if (showDistances && sortValue === "recommended") {
      setSortValue("closest");
    }
    else if (!showDistances && sortValue === "closest") {
      setSortValue("recommended");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDistances])


  const sortedWalks = useMemo(() => {
    const newWalkData = [...walks];

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
        newWalkData
          .sort((a, b) => a.title.localeCompare(b.title))
          .sort((a, b) => (b.recommendedScore ?? 0) - (a.recommendedScore ?? 0));
        break;
    }

    if (dir === "dsc") newWalkData.reverse();

    return newWalkData;
  }, [walks, sortValue])


  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);

    window.history.replaceState({}, "", `/walks?${params.toString()}`)
  }


  const searchParams = useSearchParams();
  const filterValues = useMemo(() => {
    const town = searchParams.get("town");
    const distance = searchParams.get("distance");
    const elevation = searchParams.get("elevation");
    const wainwrights = searchParams.get("wainwrights");
    const byBus = searchParams.get("byBus");


    return {
      town: town ? locations[town]?.name : undefined,
      distance: distance ? distanceOptions[distance] : undefined,
      elevation: elevation ? elevationOptions[elevation] : undefined,
      wainwrights: wainwrights?.split(" ") ?? [],
      byBus: byBus === "yes",
    }
  }, [searchParams])


  return (
    <div className={styles.grid}>
      <div className={styles.gridTop}>
        {/* <h2 className="heading">All walks</h2> */}
        <div>
          <ul className={styles.gridFiltersList}>
            {filterValues.town &&
              <FilterTag
                Icon={<LocationIcon />}
                text={filterValues.town}
                reset={() => updateParam("town")}
              />
            }
            {filterValues.distance &&
              <FilterTag
                Icon={<HikingIcon />}
                text={filterValues.distance}
                reset={() => updateParam("distance")}
              />
            }
            {filterValues.elevation &&
              <FilterTag
                Icon={<ElevationIcon />}
                text={filterValues.elevation}
                reset={() => updateParam("elevation")}
              />
              }
            {filterValues.wainwrights.map((wain, index) => {
              return (
                <FilterTag
                  key={index}
                  Icon={<MountainIcon />}
                  text={wainNames[wain]}
                  reset={() => updateParam("wainwrights", filterValues.wainwrights.filter(w => w != wain).join(" "))}
                />
              )
            })}
            {filterValues.byBus &&
              <FilterTag
                Icon={<BusIcon />}
                text={"By bus"}
                reset={() => updateParam("byBus")}
              />
            }
          </ul>
        </div>
        <select
          value={sortValue}
          onChange={e => setSortValue(e.target.value)}
        >
          <option value="recommended">Recommended</option>
          {showDistances && <option value="closest">Closest</option>}
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
        <div className={styles.gridFilters}>
          <>
            No walks match the current filters.&nbsp;
            <button
              className={`${buttonStyles.button} ${buttonStyles.underlined}`}
              onClick={() => resetFilters()}
            >
              Reset filters
            </button>
          </>
          {/* {walks.length > 0
            ? <>Showing <b>{walks.length + " walk" + (walks.length === 1 ? "" : "s")}</b> matching filters. <button className="button underlined" onClick={() => resetFilters()}>Reset filters</button></>
            : <>No walks match the current filters. <button className="button underlined" onClick={() => resetFilters()}>Reset filters</button></>
          } */}
        </div>
      }

      <div className={styles.gridGrid}>
        {sortedWalks.map((walk, index) => {
          return <WalkCard key={index}
                    walk={walk}
                    showDistance={showDistances}
                 />
        })}
      </div>

      {walks.length > 0 &&
        <p className={styles.gridEndText}>
          Showing {walks.length + " walk" + (walks.length !== 1 ? "s" : "")} in the Lake District.&nbsp;
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


function FilterTag({ Icon, text, reset } : { Icon: React.ReactNode; text?: string; reset?: CallableFunction }) {

  if (text === undefined) return <></>
  else return (
    <li>
      <div>
        {Icon}
        {text}
      </div>
      <button onClick={() => {if (reset) reset()}} title="Remove filter">
        <CloseIconSmall />
      </button>
    </li>
  )
}
