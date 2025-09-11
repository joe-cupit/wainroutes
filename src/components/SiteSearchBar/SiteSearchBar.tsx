'use client';

import styles from "./SiteSearchBar.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { useMemo, useState } from "react";
import Link from "next/link";

import tempwalks from "@/data/walks.json";
import temphills from "@/data/hills.json";
import Walk from "@/types/Walk";
import Hill from "@/types/Hill";
import { HikingIcon, LocationIcon, MountainIcon } from "@/icons/MaterialIcons";
import { displayDistance, displayElevation } from "@/utils/unitConversions";


type WalkOption = {
  type: "walk";
  name: string;
  link: string;
  walk: {
    length: number;
    wainwrights: number;
  };
}
type FellOption = {
  type: "fell";
  name: string;
  secondaryName?: string,
  link: string;
  hill: {
    height: number;
    book: string
  };
}
type TownOption = {
  type: "town";
  name: string;
  link: string;
}

type SearchOption = WalkOption | FellOption | TownOption



const BookTitles : {[book : number]: string} = {
  1: "The Eastern Fells", 2: "The Far Eastern Fells", 3: "The Central Fells", 4: "The Southern Fells", 5: "The Northern Fells", 6: "The North Western Fells", 7: "The Western Fells"
}


export default function SiteSearchBar({ reversed, small, placeholder, className } : { reversed?: boolean; small?: boolean; placeholder?: string; className?: string }) {

  const [searchTerm, setSearchTerm] = useState("");

  const walksData = tempwalks as unknown as Walk[];
  const hillsData = temphills as Hill[];
  const searchOptions = useMemo(() => {
    const newSearchOptions : SearchOption[] = [];

    if (walksData) {
      for (const walk of walksData) {
        newSearchOptions.push({
          type: "walk",
          name: walk.title,
          link: "/walks/"+walk.slug,
          walk: {
            length: walk.length ?? 0,
            wainwrights: walk.wainwrights?.length ?? 0
          }
        });
      }
    }
    if (hillsData) {
      for (const hill of hillsData) {
        newSearchOptions.push({
          type: "fell",
          name: hill.name,
          secondaryName: hill.secondaryName,
          link: "/walks?wainwrights="+hill.slug,
          hill: {
            height: hill.height,
            book: BookTitles[hill.book]
          }
        });
      }
    }
    // for (let townKey of Object.keys(locations)) {
    //   newSearchOptions.push({
    //     type: "town",
    //     name: locations[townKey]!.name,
    //     link: "/walks?town=" + townKey
    //   })
    // }

    return newSearchOptions;
  }, [walksData, hillsData])

  const filteredSearchOptions = useMemo(() => {
    if (searchTerm === "") return [];

    const lowerSearchTerm = searchTerm.trim().toLowerCase();
    return searchOptions
            .filter(option => option.name.toLowerCase().includes(lowerSearchTerm))
            .sort((a, b) => a.name.toLowerCase().indexOf(lowerSearchTerm) - b.name.toLowerCase().indexOf(lowerSearchTerm))
            .sort((a, b) => (b.name.toLowerCase() === lowerSearchTerm) ? 1 : 0);
  }, [searchTerm, searchOptions])


  return (
    <div
      className={`${styles.siteSearch} ${className ?? ""}`}
      data-small={small}
    >
      <input type="text"
        placeholder={placeholder ? placeholder : "Search for a route, fell, or town"}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {searchTerm.length > 0 &&
        <div
          className={styles.results}
          data-reversed={reversed}
          onMouseDown={e => e.preventDefault()}
        >
          {filteredSearchOptions.length > 0
            ? filteredSearchOptions.map((option, index) => {
                return <SearchResult key={index} option={option} />
              })
            : <div className={styles.noResults}>No matching routes, fells, or towns</div>
          }
        </div>
      }
    </div>
  )
}


function SearchResult({ option } : { option : SearchOption }) {
  return (
    <Link href={option.link} className={styles.result}>
      <div className={styles.resultType}>
        {option.type === "fell" && <MountainIcon />}
        {option.type === "walk" && <HikingIcon />}
        {option.type === "town" && <LocationIcon />}
      </div>
      <div>
        <h2 className={`${fontStyles.subheading} ${styles.subheading}`}>
          {option.type === "fell"
            ? (option.name + (option.secondaryName ? " ("+option.secondaryName+")" : ""))
            : option.name
          }
        </h2>
        <p className={styles.resultDetails}>
          {option.type === "fell" && <>
            <span>{option.hill.book}</span>
            <span>•</span><span>{displayElevation(option.hill.height)}</span>
          </>}
          {option.type === "walk" && <>
            <span>Route</span>
            <span>•</span><span>{displayDistance(option.walk.length)}</span>
            <span>•</span><span>{option.walk.wainwrights + " Wainwright" + (option.walk.wainwrights !== 1 ? "s" : "")}</span>
          </>}
          {option.type === "town" && "Town"}
        </p>
      </div>
    </Link>
  )
}
