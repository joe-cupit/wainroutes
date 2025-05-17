import "./WalkSearch.css";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";
import { locations } from "../pages/WalksPage";
import { Walk } from "../pages/WalkPage/WalkPage";
import { BookTitles, Hill } from "../pages/HillPage";

import { HikingIcon, LocationIcon, MountainIcon } from "./Icons";
import { displayDistance, displayElevation } from "../utils/unitConversions";


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
  const [showResults, setShowResults] = useState(false);

  const searchOptions = useMemo(() => {
    var newSearchOptions : SearchOption[] = [];

    for (let hill of Object.values(useHills() as { [slug: string] : Hill })) {
      newSearchOptions.push({
        type: "fell",
        name: hill.name,
        secondaryName: hill.name_secondary,
        link: "/walks?wainwrights="+hill.slug,
        hill: {
          height: hill.height,
          book: BookTitles[hill.book]
        }
      });
    }
    for (let walk of Object.values(useWalks() as { [slug: string] : Walk })) {
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
    for (let town of Object.values(locations)) {
      if (town) {
        newSearchOptions.push({
          type: "town",
          name: town.name,
          link: "/walks?town=" + town.slug
        })
      }
    }

    return newSearchOptions;
  }, [])

  const filteredSearchOptions = useMemo(() => {
    if (searchTerm === "") return [];

    const lowerSearchTerm = searchTerm.trim().toLowerCase();
    return searchOptions
            .filter(option => option.name.toLowerCase().includes(lowerSearchTerm))
            .sort((a, b) => a.name.toLowerCase().indexOf(lowerSearchTerm) - b.name.toLowerCase().indexOf(lowerSearchTerm));
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
        onBlur={() => setTimeout(() => {setShowResults(false)}, 100)}
        onFocus={() => setShowResults(true)}
      />
      {searchTerm.length > 0 &&
        <div
          className="walk-search__results"
          data-reversed={reversed}
          data-show={showResults}
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
