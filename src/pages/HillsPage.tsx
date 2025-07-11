import "./HillsPage.css"

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import setPageTitle from "../hooks/setPageTitle";
import { displayElevation } from "../utils/unitConversions";
import { LakeMap } from "../components/map";
import { useHillMarkers } from "../hooks/useMarkers";
import { BackToTopIcon } from "../components/Icons";
import { useHills } from "../contexts/HillsContext";


const titles : {[book : number]: string} = {
  1: "The Eastern Fells", 2: "The Far Eastern Fells", 3: "The Central Fells", 4: "The Southern Fells", 5: "The Northern Fells", 6: "The North Western Fells", 7: "The Western Fells"
}


export function HillsPage() {
  setPageTitle("The Wainwrights");

  const hillMarkers = useHillMarkers();
  const hillData = useHills().hills;

  const [filterTerm, setFilterTerm] = useState("");

  const [sortMode, setSortMode] = useState("height");
  const [sortStates, setSortStates] = useState([false, false, true]);

  const [hoveredSlug, setHoveredSlug] = useState<string|null>(null);


  function updateSortMode(newSortMode: string) {
    if (newSortMode == sortMode) {
      switch (newSortMode) {
        case "book":
          setSortStates([!sortStates[0], sortStates[1], sortStates[2]]);
          break;
        case "mountain":
          setSortStates([sortStates[0], !sortStates[1], sortStates[2]]);
          break;
        case "height":
          setSortStates([sortStates[0], sortStates[1], !sortStates[2]]);
          break;
        default:
          break;
      }
    }
    else {
      setSortMode(newSortMode);
    }
  }

  const hillList = useMemo(() => {
    if (!hillData) return [];

    switch (sortMode) {
      case "book":
        if (!sortStates[0]) return [...hillData].sort((a, b) => a.book-b.book);
        else return [...hillData].sort((b, a) => a.book-b.book);
      case "mountain":
        if (!sortStates[1]) return [...hillData].sort((a, b) => a.name.localeCompare(b.name));
        else return [...hillData].sort((b, a) => a.name.localeCompare(b.name));
      case "height":
        if (!sortStates[2]) return [...hillData].sort((a, b) => a.height-b.height);
        else return [...hillData].sort((b, a) => a.height-b.height);
      default:
        return [];
    }
  }, [hillData, sortMode, sortStates])


  const filteredHills = useMemo(() => {
    const filterTermLower = filterTerm.toLowerCase();
    return [...hillList].filter(hill => hill.name.toLowerCase().includes(filterTermLower));
  }, [hillList, filterTerm])


  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    function toggleOverlay() {
      if ((document.scrollingElement?.scrollTop ?? 0) < 400) {
        setShowScrollTop(false);
      }
      else {
        setShowScrollTop(true);
      }
    }

    window.addEventListener("scroll", toggleOverlay);
    return () => {
      window.removeEventListener("scroll", toggleOverlay);
    }
  }, [])


  return (
    <main className="hills-page">

      <section>
        <div className="hills_header">
          <h1 className="title">The 214 Wainwrights</h1>
          <p>214 fells within The Lake District, as described in A. Wainwright's <i>Pictorial Guides to the Lakeland Fells</i>.</p>
        </div>
      </section>

      <section>
        <div className="hills__main">
          <div className="hills__list">
            <button
              className="hills__top-button"
              onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
              data-show={showScrollTop}
              aria-label="Back to top"
              title="Back to top"
            >
              <BackToTopIcon />
            </button>

            <div className="hills__search">
              <input type="text" placeholder="search for a fell" value={filterTerm} onChange={e => setFilterTerm(e.target.value)} />
            </div>

            <table>
              <thead>
                <tr>
                  <td role="button" onClick={() => updateSortMode("book")}>Book <span className={"table-arrow" + (sortMode==="book" ? " active" : "")}>{sortStates[0] ? "↓": "↑"}</span></td>
                  <td role="button" onClick={() => updateSortMode("mountain")} className="hills-table__mountain">Mountain <span className={"table-arrow" + (sortMode==="mountain" ? " active" : "")}>{sortStates[1] ? "↓": "↑"}</span></td>
                  <td role="button" onClick={() => updateSortMode("height")}>Height <span className={"table-arrow" + (sortMode==="height" ? " active" : "")}>{sortStates[2] ? "↓": "↑"}</span></td>
                </tr>
              </thead>
              <tbody>
                {filteredHills.length > 0 &&
                  filteredHills?.map((hill, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className="wainwright-book-top" data-book={hill.book} title={titles[hill.book]}>
                            <div className="wainwright-book-top-color" />
                          </div>
                        </td>
                        <td className="flex-column gap-0">
                          <h2 className="subheading">
                            <Link
                              to={`/wainwrights/${hill.slug}`}
                              onMouseEnter={() => setHoveredSlug(hill.slug)}
                              onMouseLeave={() => setHoveredSlug(null)}
                            >
                              {hill.name}{hill.secondaryName ? <span className="secondary-text"> ({hill.secondaryName})</span> : ""}
                            </Link>
                          </h2>
                          <span className="secondary-text">{titles[hill.book]}</span>
                        </td>
                        <td className="hills__table-height">{displayElevation(hill.height)}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            {filterTerm && <p className="hills__list-note">{filteredHills.length === 0 ? "No" : "Showing all"} Wainwrights matching <i>{"'"+filterTerm+"'"}</i></p>}
          </div>

          <div className="hills__map">
            <LakeMap
              mapMarkers={hillMarkers}
              activePoint={hoveredSlug}
            />
          </div>
        </div>
      </section>

      <div style={{height: "5rem"}}></div>

    </main>
  )
}