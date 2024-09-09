import "./HillsPage.css"

import { Link } from "react-router-dom";

import { LakeMap } from "../components/map";

import { useHillMarkers } from "../hooks/useMarkers";
import { useHills } from "../hooks/useHills";
import { useState } from "react";

const titles = {
  1: "The Eastern Fells", 2: "The Far Eastern Fells", 3: "The Central Fells", 4: "The Southern Fells", 5: "The Northern Fells", 6: "The North Western Fells", 7: "The Western Fells"
}


export function HillsPage() {
  document.title = "214 Wainwrights | wainroutes";

  const hillMarkers = useHillMarkers();
  const hillData = Object.values(useHills(null)).sort((a, b) => b.height-a.height);
  const [hillList, setHillList] = useState(hillData);

  const [sortStates, setSortStates] = useState([true, true, true]);

  function sortHillData(sortBy) {
    switch (sortBy) {
      case "book":
        if (sortStates[0]) setHillList([...hillList].sort((a, b) => a.book-b.book));
        else setHillList([...hillList].sort((b, a) => a.book-b.book));
        setSortStates([!sortStates[0], sortStates[1], sortStates[2]]);
        break;
      case "mountain":
        if (sortStates[1]) setHillList([...hillList].sort((a, b) => a.name.localeCompare(b.name)));
        else setHillList([...hillList].sort((b, a) => a.name.localeCompare(b.name)));
        setSortStates([sortStates[0], !sortStates[1], sortStates[2]]);
        break;
      case "height":
        if (sortStates[2]) setHillList([...hillList].sort((a, b) => a.height-b.height));
        else setHillList([...hillList].sort((b, a) => a.height-b.height));
        setSortStates([sortStates[0], sortStates[1], !sortStates[2]]);
        break;
      default:
        break;
    }
  }


  return (
    <main className="hill-page grid-group">
      <h1 className="page-title">The <span className="wainwright-number">214</span> Wainwrights</h1>

      <div className="hill-page_container">
        <section className="hill-page_map">
          <div className="hill-page_map-container">
            <LakeMap mapMarkers={hillMarkers} />
          </div>
        </section>

        <section className="hill-page_hill-list">
          <input placeholder="Search..."/>

          <table className="hill-page_hill-table">
            <thead>
              <tr>
                <td onClick={() => sortHillData("book")}>Book {sortStates[0] ? "↓": "↑"}</td>
                <td onClick={() => sortHillData("mountain")}>Mountain {sortStates[1] ? "↓": "↑"}</td>
                <td onClick={() => sortHillData("height")} className="hill-card_height">Height {sortStates[2] ? "↓": "↑"}</td>
              </tr>
            </thead>
            <tbody>
              {hillList?.map((hill, index) => {
                return (
                  <tr key={index} className="hill-card">
                    <td>
                      <div className="hill-card_book grid-group">
                        <div className="hill-card_book-bind" data-book={hill.book}></div>
                      </div>
                    </td>
                    <td className="hill-card_name flex-group flex-column">
                      <Link to={`/mountain/${hill.slug}`}><h2>{hill.name}{hill.name_secondary ? <span className="hill-card_name-secondary"> ({hill.name_secondary})</span> : ""}</h2></Link>
                      <span className="hill-card_name-book">{titles[hill.book]}</span>
                    </td>
                    <td className="hill-card_height">{hill.height}m</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}