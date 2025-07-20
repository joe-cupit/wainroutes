import "./WalkSearch.css";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { BookTitles } from "../pages/HillPage";

import { HikingIcon, LocationIcon, MountainIcon } from "./Icons";
import { displayDistance, displayElevation } from "../utils/unitConversions";
import { useWalks } from "../contexts/WalksContext";
import { useHills } from "../contexts/HillsContext";
import { locations } from "../pages/WalksPage/utils/FilterValues";


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


export default function WalkSearch({ reversed, small, placeholder, className } : { reversed?: boolean; small?: boolean; placeholder?: string; className?: string }) {

  const [searchTerm, setSearchTerm] = useState("");

  const walksData = useWalks().walks;
  const hillsData = useHills().hills;
  const searchOptions = useMemo(() => {
    var newSearchOptions : SearchOption[] = [];

    if (walksData) {
      for (let walk of walksData) {
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
      for (let hill of hillsData) {
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
    for (let townKey of Object.keys(locations)) {
      newSearchOptions.push({
        type: "town",
        name: locations[townKey]!.name,
        link: "/walks?town=" + townKey
      })
    }

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
      className={"walk-search" + (className ? " "+className : "")}
      data-small={small}
    >
      <input type="text"
        placeholder={placeholder ? placeholder : "Search for a route, fell, or town"}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {searchTerm.length > 0 &&
        <div
          className="walk-search__results"
          data-reversed={reversed}
          onMouseDown={e => e.preventDefault()}
        >
          {filteredSearchOptions.length > 0
            ? filteredSearchOptions.map((option, index) => {
                return <SearchResult key={index} option={option} />
              })
            : <div className="walk-search__no-results">No matching routes, fells, or towns</div>
          }
        </div>
      }
    </div>
  )
}


function SearchResult({ option } : { option : SearchOption }) {
  return (
    <Link to={option.link} className="walk-search__result">
      <div className="walk-search__result-type">
        {option.type === "fell" && <MountainIcon />}
        {option.type === "walk" && <HikingIcon />}
        {option.type === "town" && <LocationIcon />}
      </div>
      <div>
        <h2 className="subheading">
          {option.type === "fell"
            ? (option.name + (option.secondaryName ? " ("+option.secondaryName+")" : ""))
            : option.name
          }
        </h2>
        <p className="walk-search__result-details">
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
