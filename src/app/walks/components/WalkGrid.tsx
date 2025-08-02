import styles from "../Walks.module.css";
import buttonStyles from "@/app/buttons.module.css";

import Walk from "@/types/Walk";
import WalkCard from "@/app/components/WalkCard/WalkCard";

import tempwalks from "@/data/walks.json";


export default function WalkGrid() {
  // { walks, hasLocationParam, sortControl, setHoveredSlug } : { walks?: Walk[]; hasLocationParam?: boolean; sortControl: {value: string; set: CallableFunction}; setHoveredSlug?: CallableFunction }) {

  const walks = tempwalks as unknown as Walk[];
  // const sortControl : {value: string; set: CallableFunction} = {value: "", set: () => {}}

  const hasLocationParam = false;

  return (
    <div className={styles.grid}>
      <div className={styles.gridTop}>
        {/* <h2 className="heading">All walks</h2> */}
        {/* <div>
          <ul className={styles.grid-filters-list}>
            {(filterObjects.town.currentValue !== "any") && <FilterTag reset={filterObjects.town.setCurrentValue} Icon={<LocationIcon />} text={locations[filterObjects.town.currentValue]?.name} />}
            {(filterObjects.distance.currentValue !== "any") && <FilterTag reset={filterObjects.distance.setCurrentValue} Icon={<HikingIcon />} text={distanceOptions[filterObjects.distance.currentValue]} />}
            {(filterObjects.elevation.currentValue !== "any") && <FilterTag reset={filterObjects.elevation.setCurrentValue} Icon={<ElevationIcon />} text={elevationOptions[filterObjects.elevation.currentValue]} />}
            {filterObjects.wainwrights.currentValues.map((wain, index) => {
              return <FilterTag reset={() => filterObjects.wainwrights.setCurrentValues(filterObjects.wainwrights.currentValues.filter(w => w != wain))} key={index} Icon={<MountainIcon />} text={filterObjects.wainwrights.values[wain] ?? ""} />
            })}
            {(filterObjects.byBus.currentValue === "byBus") && <FilterTag reset={filterObjects.byBus.setCurrentValue} Icon={<BusIcon />} text={"By bus"} />}
          </ul>
        </div> */}
        <select
          // value={sortControl.value}
          // onChange={e => sortControl.set(e.target.value)}
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
        <div className={styles.gridFilters}>
          <>No walks match the current filters. <button className={`${buttonStyles.button} ${buttonStyles.underlined}`}>Reset filters</button></>
          {/* {walks.length > 0
            ? <>Showing <b>{walks.length + " walk" + (walks.length === 1 ? "" : "s")}</b> matching filters. <button className="button underlined" onClick={() => resetFilters()}>Reset filters</button></>
            : <>No walks match the current filters. <button className="button underlined" onClick={() => resetFilters()}>Reset filters</button></>
          } */}
        </div>
      }

      <div className={styles.gridGrid}>
        {walks.map((walk, index) => {
          return <WalkCard key={index}
                    walk={walk}
                    showDistance={hasLocationParam}
                 />
        })}
      </div>

      {walks.length > 0 &&
        <p className={styles.gridEndText}>
          Showing {walks.length + " walk" + (walks.length !== 1 ? "s" : "")} in the Lake District.&nbsp;
          <button
            // onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
            title="Scroll to top"
          >
            Back to top
          </button>.
        </p>
      }
    </div>
  )
}


// function FilterTag({ reset, Icon, text } : { reset: CallableFunction; Icon: ReactNode; text?: string }) {

//   if (text === undefined) return <></>
//   else return (
//     <li>
//       <div>
//         {Icon}
//         {text}
//       </div>
//       <button onClick={() => reset()} title="Remove filter">
//         <CloseIconSmall />
//       </button>
//     </li>
//   )
// }
