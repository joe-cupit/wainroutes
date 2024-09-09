import "./HillsPage.css"

import { Link } from "react-router-dom";

import { LakeMap } from "../components/map";

import { useHillMarkers } from "../hooks/useMarkers";
import { useHills } from "../hooks/useHills";

const titles = {
  1: "The Eastern Fells", 2: "The Far Eastern Fells", 3: "The Central Fells", 4: "The Southern Fells", 5: "The Northern Fells", 6: "The North Western Fells", 7: "The Western Fells"
}


export function HillsPage() {
  document.title = "214 Wainwrights | wainroutes";

  const hillMarkers = useHillMarkers();
  const hillData = Object.values(useHills(null)).sort((a, b) => b.height-a.height);
  console.log(hillData)

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
                <td>Book</td>
                <td>Mountain</td>
                <td className="hill-card_height">Height</td>
              </tr>
            </thead>
            <tbody>
              {hillData?.map((hill, index) => {
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