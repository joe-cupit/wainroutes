import styles from "../Walks.module.css";

import { FilterIcon, SearchIcon } from "@/icons/WalkIcons";


export default function WalksSearchBar() {

  return (
    <div style={{zIndex: "9999"}}>
      <div className={styles.filterSearch}>
        <div
          className={styles.searchBar}
          // onClick={() => searchRef.current?.focus()}
        >
          <SearchIcon />
          <input
            type="search"
            // ref={searchRef}
            placeholder="Search for a walk"
            // value={searchTerm}
            // onChange={e => setSearchTerm(e.target.value)}
          />
          {/* {searchTerm.length > 0 &&
            <button
              className={styles.search-bar-button}
              // onClick={() => setSearchTerm("")}
              title="Clear text"
            >
              <CloseIconSmall />
            </button>
          } */}
        </div>
        <button
          className={styles.filterButton}
          // onClick={() => setShowFilters(prev => !prev)}
          // data-open={showFilters}
        >
          <span>Filters</span> <FilterIcon />
          {/* {showFilters
            ? <CloseIcon />
            : <FilterIcon />
          } */}
        </button>
      </div>
      
      {/* {showFilters &&
        <Filters
          filterData={Object.values(filterObjects)}
          className={styles.filters}
          closeSelf={() => setShowFilters(false)}
        />
      } */}
    </div>
  )
}
