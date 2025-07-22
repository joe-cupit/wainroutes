import { ReactNode, useEffect } from "react";

import { BusIcon, CloseIconSmall, ElevationIcon, HikingIcon, LocationIcon, MountainIcon } from "../../../components/Icons";
import WalkCard from "../../../components/WalkCard";
import { Walk } from "../../WalkPage/WalkPage";
import { useFilters } from "../contexts/FilterContext";
import { distanceOptions, elevationOptions, locations } from "../utils/FilterValues";


export default function WalkGrid({ walks, hasLocationParam, sortControl, setHoveredSlug } : { walks: Walk[]; hasLocationParam?: boolean; sortControl: {value: string; set: CallableFunction}; setHoveredSlug?: CallableFunction }) {

  const { filterObjects, reset } = useFilters();

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
            {(filterObjects.town.currentValue !== "any") && <FilterTag reset={filterObjects.town.setCurrentValue} Icon={<LocationIcon />} text={locations[filterObjects.town.currentValue]?.name} />}
            {(filterObjects.distance.currentValue !== "any") && <FilterTag reset={filterObjects.distance.setCurrentValue} Icon={<HikingIcon />} text={distanceOptions[filterObjects.distance.currentValue]} />}
            {(filterObjects.elevation.currentValue !== "any") && <FilterTag reset={filterObjects.elevation.setCurrentValue} Icon={<ElevationIcon />} text={elevationOptions[filterObjects.elevation.currentValue]} />}
            {filterObjects.wainwrights.currentValues.map((wain, index) => {
              return <FilterTag reset={() => filterObjects.wainwrights.setCurrentValues(filterObjects.wainwrights.currentValues.filter(w => w != wain))} key={index} Icon={<MountainIcon />} text={filterObjects.wainwrights.values[wain] ?? ""} />
            })}
            {(filterObjects.byBus.currentValue === "byBus") && <FilterTag reset={filterObjects.byBus.setCurrentValue} Icon={<BusIcon />} text={"By bus"} />}
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
          <>No walks match the current filters. <button className="button underlined" onClick={() => reset()}>Reset filters</button></>
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


function FilterTag({ reset, Icon, text } : { reset: CallableFunction; Icon: ReactNode; text?: string }) {

  if (text === undefined) return <></>
  else return (
    <li>
      <div>
        {Icon}
        {text}
      </div>
      <button onClick={() => reset()} title="Remove filter">
        <CloseIconSmall />
      </button>
    </li>
  )
}
