"use client";

import styles from "../Walks.module.css";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CloseIconSmall, FilterIcon, SearchIcon } from "@/icons/WalkIcons";


export default function WalksSearchBar() {

  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(searchParams.get("query") ?? "");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") ?? "");

  useEffect(() => {
    if (inputValue === "") {
      setSearchTerm("")
      return;
    }
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue])

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set("query", searchTerm);
    else params.delete("query");

    // router.replace(`?${params.toString()}`);
    window.history.replaceState({}, "", `/walks?${params.toString()}`)
  }, [searchTerm])

  useEffect(() => {
    const query = searchParams.get("query") ?? "";
    setSearchTerm(query);
    setInputValue(query);
  }, [searchParams.get("query")])


  return (
    <div style={{zIndex: "9999"}}>
      <div className={styles.filterSearch}>
        <div
          className={styles.searchBar}
          onClick={() => searchRef.current?.focus()}
        >
          <SearchIcon />
          <input
            type="search"
            ref={searchRef}
            placeholder="Search for a walk"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          {inputValue.length > 0 &&
            <button
              className={styles.searchBarButton}
              onClick={() => setInputValue("")}
              title="Clear text"
            >
              <CloseIconSmall />
            </button>
          }
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
