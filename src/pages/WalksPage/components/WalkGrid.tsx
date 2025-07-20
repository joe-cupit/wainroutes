import { ReactNode, useEffect } from "react";
import { CloseIconSmall } from "../../../components/Icons";
import WalkCard from "../../../components/WalkCard";
import { Walk } from "../../WalkPage/WalkPage";


export default function WalkGrid({ walks, hasLocationParam, sortControl, setHoveredSlug } : { walks: Walk[]; hasLocationParam?: boolean; sortControl: {value: string; set: CallableFunction}; setHoveredSlug?: CallableFunction }) {

  useEffect(() => {
    if (hasLocationParam && sortControl.value === "recommended") sortControl.set("closest");
    else if (!hasLocationParam && sortControl.value === "closest") sortControl.set("recommended");
  }, [hasLocationParam])


  return (
    <div className="walks__grid">
      <div className="walks__grid-top">
        {/* <h2 className="heading">All walks</h2> */}
        <div>
          {/* <ul className="walks__grid-filters-list">
            {activeFilters.town && <FilterTag reset={resetFilters.town} Icon={<TownIconSmall />} text={activeFilters.town} />}
            {activeFilters.wainwrights?.map((wain, index) => {
              return <FilterTag reset={() => resetFilters.wainwrights(wain[0])} key={index} Icon={<MountainIconSmall />} text={wain[1]} />
            })}
            {(activeFilters.distance && activeFilters.distance !== "any") && <FilterTag reset={resetFilters.distance} Icon={<DistanceIconSmall />} text={activeFilters.distance} />}
            {(activeFilters.elevation && activeFilters.elevation !== "any") && <FilterTag reset={resetFilters.elevation} Icon={<ElevationIconSmall />} text={activeFilters.elevation} />}
            {activeFilters.byBus && <FilterTag reset={resetFilters.byBus} Icon={<BusIconSmall />} text={"By Bus"} />}
          </ul> */}
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
          {/* {activeFilters
            ? <>Showing {walks.length} walks matching filters. </>
            : <>Showing all {walks.length} walks. </>
          } */}
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
