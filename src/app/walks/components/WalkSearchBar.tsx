"use client";

import styles from "../Walks.module.css";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  CloseIcon,
  CloseIconSmall,
  FilterIcon,
  SearchIcon,
} from "@/icons/MaterialIcons";

type WalkSearchBarProps = {
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WalksSearchBar({
  showFilters,
  setShowFilters,
}: WalkSearchBarProps) {
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(searchParams.get("query") ?? "");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") ?? "");

  useEffect(() => {
    if (inputValue === "") {
      setSearchTerm("");
      return;
    }
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set("query", searchTerm);
    else params.delete("query");

    window.history.replaceState({}, "", `/walks?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    const query = searchParams.get("query") ?? "";
    setSearchTerm(query);
    setInputValue(query);
  }, [searchParams]);

  return (
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
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue.length > 0 && (
          <button
            className={styles.searchBarButton}
            onClick={() => setInputValue("")}
            title="Clear text"
          >
            <CloseIconSmall />
          </button>
        )}
      </div>
      <button
        className={styles.filterButton}
        onClick={() => setShowFilters((prev) => !prev)}
        data-open={showFilters}
        title="Toggle filter visibility"
      >
        <span>Filters</span>
        {showFilters ? <CloseIcon /> : <FilterIcon />}
      </button>
    </div>
  );
}
