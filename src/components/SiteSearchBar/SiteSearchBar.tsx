"use client";

import styles from "./SiteSearchBar.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

import tempwalks from "@/data/walks.json";
import temphills from "@/data/hills.json";
import { locations } from "@/app/walks/components/WalkFilterValues";
import Walk from "@/types/Walk";
import Hill from "@/types/Hill";
import {
  CloseIconSmall,
  HikingIcon,
  LocationIcon,
  MountainIcon,
} from "@/icons/MaterialIcons";
import { displayDistance, displayElevation } from "@/utils/unitConversions";

type WalkOption = {
  type: "walk";
  name: string;
  link: string;
  walk: {
    length: number;
    wainwrights: number;
  };
};
type FellOption = {
  type: "fell";
  name: string;
  secondaryName?: string;
  link: string;
  hill: {
    height: number;
    book: string;
  };
};
type TownOption = {
  type: "town";
  name: string;
  link: string;
};

type SearchOption = WalkOption | FellOption | TownOption;

const BookTitles: { [book: number]: string } = {
  1: "The Eastern Fells",
  2: "The Far Eastern Fells",
  3: "The Central Fells",
  4: "The Southern Fells",
  5: "The Northern Fells",
  6: "The North Western Fells",
  7: "The Western Fells",
};

function scoreResult(res: { item: SearchOption; score?: number }) {
  const score = res.score ?? 1;

  switch (res.item.type) {
    case "walk":
      return score * 0.5;
    case "town":
      return score * 0.8;
    default:
      return score * 1.2;
  }
}

export default function SiteSearchBar({
  reversed,
  small,
  placeholder,
  className,
}: {
  reversed?: boolean;
  small?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const closeInput = useCallback(() => {
    inputRef.current?.blur();
    setSearchTerm("");
  }, [inputRef, setSearchTerm]);

  const walksData = tempwalks as unknown as Walk[];
  const hillsData = temphills as Hill[];
  const searchOptions = useMemo(() => {
    const newSearchOptions: SearchOption[] = [];

    if (walksData) {
      for (const walk of walksData) {
        newSearchOptions.push({
          type: "walk",
          name: walk.title,
          link: "/walks/" + walk.slug,
          walk: {
            length: walk.length ?? 0,
            wainwrights: walk.wainwrights?.length ?? 0,
          },
        });
      }
    }
    if (hillsData) {
      for (const hill of hillsData) {
        newSearchOptions.push({
          type: "fell",
          name: hill.name,
          secondaryName: hill.secondaryName,
          link: "/walks?wainwrights=" + hill.slug,
          hill: {
            height: hill.height,
            book: BookTitles[hill.book],
          },
        });
      }
    }
    for (const townKey of Object.keys(locations)) {
      newSearchOptions.push({
        type: "town",
        name: locations[townKey]!.name,
        link: "/walks?town=" + townKey,
      });
    }

    return new Fuse(newSearchOptions, {
      keys: ["name"],
      threshold: 0.3,
      distance: 200,
      includeScore: true,
    });
  }, [walksData, hillsData]);

  const filteredSearchOptions = useMemo(() => {
    if (searchTerm === "") return [];

    return searchOptions
      .search(searchTerm, { limit: 20 })
      .sort((a, b) => scoreResult(a) - scoreResult(b))
      .map((res) => res.item);
  }, [searchTerm, searchOptions]);

  return (
    <div
      className={`${styles.siteSearch} ${className ?? ""}`}
      data-small={small}
    >
      <div
        className={styles.siteSearchBar}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={
            placeholder ? placeholder : "Search for a route, fell, or town"
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && (
          <button
            className={styles.siteSearchBarButton}
            onClick={() => setSearchTerm("")}
            title="Clear text"
          >
            <CloseIconSmall />
          </button>
        )}
      </div>
      {searchTerm.length > 0 && (
        <div
          className={styles.results}
          data-reversed={reversed}
          onMouseDown={(e) => e.preventDefault()}
        >
          {filteredSearchOptions.length > 0 ? (
            filteredSearchOptions.map((option, index) => {
              return (
                <SearchResult
                  key={index}
                  option={option}
                  closeInput={closeInput}
                />
              );
            })
          ) : (
            <div className={styles.noResults}>
              No matching routes, fells, or towns
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResult({
  option,
  closeInput,
}: {
  option: SearchOption;
  closeInput: CallableFunction;
}) {
  return (
    <Link
      href={option.link}
      className={styles.result}
      onClick={() => closeInput()}
    >
      <div className={styles.resultType}>
        {option.type === "fell" && <MountainIcon />}
        {option.type === "walk" && <HikingIcon />}
        {option.type === "town" && <LocationIcon />}
      </div>
      <div>
        <h2 className={`${fontStyles.subheading} ${styles.subheading}`}>
          {option.type === "fell"
            ? option.name +
              (option.secondaryName ? " (" + option.secondaryName + ")" : "")
            : option.name}
        </h2>
        <p className={styles.resultDetails}>
          {option.type === "fell" && (
            <>
              <span>{option.hill.book}</span>
              <span>•</span>
              <span>{displayElevation(option.hill.height)}</span>
            </>
          )}
          {option.type === "walk" && (
            <>
              <span>Route</span>
              <span>•</span>
              <span>{displayDistance(option.walk.length)}</span>
              <span>•</span>
              <span>
                {option.walk.wainwrights +
                  " Wainwright" +
                  (option.walk.wainwrights !== 1 ? "s" : "")}
              </span>
            </>
          )}
          {option.type === "town" && "Town"}
        </p>
      </div>
    </Link>
  );
}
