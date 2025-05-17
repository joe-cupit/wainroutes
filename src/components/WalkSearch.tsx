import "./WalkSearch.css";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useHills } from "../hooks/useHills";
import { useWalks } from "../hooks/useWalks";
import { locations } from "../pages/WalksPage";
import { Walk } from "../pages/WalkPage/WalkPage";
import { Hill } from "../pages/HillPage";

import { HikingIcon, LocationIcon, MountainIcon } from "./Icons";


type SearchOption = {
  type: "walk" | "fell" | "town";
  name: string;
  link: string;
}


export default function WalkSearch({ reversed, small, placeholder, className } : { reversed?: boolean; small?: boolean; placeholder?: string; className?: string }) {

  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const searchOptions = useMemo(() => {
    var newSearchOptions : SearchOption[] = [];

    for (let hill of Object.values(useHills() as { [slug: string] : Hill })) {
      newSearchOptions.push({
        type: "fell",
        name: hill.name,
        link: "/walks?wainwrights="+hill.slug
      });
    }
    for (let walk of Object.values(useWalks() as { [slug: string] : Walk })) {
      newSearchOptions.push({
        type: "walk",
        name: walk.title,
        link: "/walks/"+walk.slug
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

    const lowerSearchTerm = searchTerm.toLowerCase();
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
        <h2 className="subheading">{option.name}</h2>
        <p className="secondary-text">{option.type.charAt(0).toUpperCase() + option.type.slice(1)}</p>
      </div>
    </Link>
  )
}
