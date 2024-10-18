import "./HillsPage.css"

import { Link } from "react-router-dom";

import { LakeMap } from "../components/map";

import { useHillMarkers } from "../hooks/useMarkers";
import { useHills } from "../hooks/useHills";
import { useMemo, useState } from "react";

const titles = {
  1: "The Eastern Fells", 2: "The Far Eastern Fells", 3: "The Central Fells", 4: "The Southern Fells", 5: "The Northern Fells", 6: "The North Western Fells", 7: "The Western Fells"
}


export function HillsPage() {
  document.title = "214 Wainwrights | wainroutes";

  const hillMarkers = useHillMarkers();
  const hillData = Object.values(useHills(null)).sort((a, b) => b.height-a.height);
  const [hillList, setHillList] = useState(hillData);

  const [filterTerm, setFilterTerm] = useState("");

  const [sortMode, setSortMode] = useState("height");
  const [sortStates, setSortStates] = useState([false, false, true]);

  function sortHillData(sortBy) {
    switch (sortBy) {
      case "book":
        if (sortMode === "book") {
          if (sortStates[0]) setHillList([...hillList].sort((a, b) => a.book-b.book));
          else setHillList([...hillList].sort((b, a) => a.book-b.book));
          setSortStates([!sortStates[0], sortStates[1], sortStates[2]]);          
        }
        else {
          if (!sortStates[0]) setHillList([...hillList].sort((a, b) => a.book-b.book));
          else setHillList([...hillList].sort((b, a) => a.book-b.book));
        }
        setSortMode("book");
        break;
      case "mountain":
        if (sortMode === "mountain") {
          if (sortStates[1]) setHillList([...hillList].sort((a, b) => a.name.localeCompare(b.name)));
          else setHillList([...hillList].sort((b, a) => a.name.localeCompare(b.name)));
          setSortStates([sortStates[0], !sortStates[1], sortStates[2]]);          
        }
        else {
          if (!sortStates[1]) setHillList([...hillList].sort((a, b) => a.name.localeCompare(b.name)));
          else setHillList([...hillList].sort((b, a) => a.name.localeCompare(b.name)));
        }
        setSortMode("mountain");
        break;
      case "height":
        if (sortMode === "height") {
          if (sortStates[2]) setHillList([...hillList].sort((a, b) => a.height-b.height));
          else setHillList([...hillList].sort((b, a) => a.height-b.height));
          setSortStates([sortStates[0], sortStates[1], !sortStates[2]]);
        }
        else {
          if (!sortStates[2]) setHillList([...hillList].sort((a, b) => a.height-b.height));
          else setHillList([...hillList].sort((b, a) => a.height-b.height));
        }
        setSortMode("height");
        break;
      default:
        break;
    }
  }

  const filteredHills = useMemo(() => {
    return [...hillList].filter(hill => hill.name.toLowerCase().includes(filterTerm.toLowerCase()))
  }, [hillList, filterTerm])

  return (
    <main className="hills-page">
      <h1 className="page-title">The <span className="wainwright-number">214</span> Wainwrights</h1>

      <div className="hill-page_container">
        <section className="hill-page_map">
          <div className="hill-page_map-container">
            <LakeMap mapMarkers={hillMarkers} />
          </div>
        </section>

        <section className="hill-page_hill-list">
          <input placeholder="Search..." value={filterTerm} onChange={e => setFilterTerm(e.target.value)} />

          <table className="hill-page_hill-table">
            <thead>
              <tr>
                <td onClick={() => sortHillData("book")}>Book <span className={sortMode==="book" ? "hill-page_hill-table-arrow" : ""}>{sortStates[0] ? "↓": "↑"}</span></td>
                <td onClick={() => sortHillData("mountain")}>Mountain <span className={sortMode==="mountain" ? "hill-page_hill-table-arrow" : ""}>{sortStates[1] ? "↓": "↑"}</span></td>
                <td onClick={() => sortHillData("height")} className="hill-card_height">Height <span className={sortMode==="height" ? "hill-page_hill-table-arrow" : ""}>{sortStates[2] ? "↓": "↑"}</span></td>
              </tr>
            </thead>
            <tbody>
              {filteredHills.length > 0
              ? filteredHills?.map((hill, index) => {
                  return (
                    <tr key={index} className="hill-card">
                      <td>
                        <div className="hill-card_book">
                          <div className="hill-card_book-bind" data-book={hill.book}></div>
                        </div>
                      </td>
                      <td className="hill-card_name">
                        <h2>
                          {hill.hasWalk
                          ? <Link to={`/mountain/${hill.slug}`}>{hill.name}{hill.name_secondary ? <span className="hill-card_name-secondary"> ({hill.name_secondary})</span> : ""}</Link>
                          : <>{hill.name}{hill.name_secondary ? <span className="hill-card_name-secondary"> ({hill.name_secondary})</span> : ""}</>
                          }
                        </h2>
                        <span className="hill-card_name-book">{titles[hill.book]}</span>
                      </td>
                      <td className="hill-card_height">{hill.height}m</td>
                    </tr>
                  )
                })
              : `No mountains matching '${filterTerm}'`
              }
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}