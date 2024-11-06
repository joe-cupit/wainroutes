import "./HillsPage.css"

import { Link } from "react-router-dom";

import { LakeMap } from "../components/map";

import { useHillMarkers } from "../hooks/useMarkers";
import { useHills } from "../hooks/useHills";
import { useMemo, useState } from "react";
import Height from "../components/Height";

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

      <section>
        <div className="flex-column">
          <h1 className="title">The 214 Wainwrights</h1>
          <div className="hills-page-map">
            <LakeMap mapMarkers={hillMarkers} />
          </div>
        </div>
      </section>

      <section>
        <div>
          <input type="text" placeholder="Search..." value={filterTerm} onChange={e => setFilterTerm(e.target.value)} />

          <table>
            <thead>
              <tr>
                <td onClick={() => sortHillData("book")}>Book <span className={"table-arrow" + (sortMode==="book" ? " active" : "")}>{sortStates[0] ? "↓": "↑"}</span></td>
                <td onClick={() => sortHillData("mountain")}>Mountain <span className={"table-arrow" + (sortMode==="mountain" ? " active" : "")}>{sortStates[1] ? "↓": "↑"}</span></td>
                <td onClick={() => sortHillData("height")} className="hill-card_height">Height <span className={"table-arrow" + (sortMode==="height" ? " active" : "")}>{sortStates[2] ? "↓": "↑"}</span></td>
              </tr>
            </thead>
            <tbody>
              {filteredHills.length > 0
              ? filteredHills?.map((hill, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="wainwright-book-top" data-book={hill.book}>
                          <div className="wainwright-book-top-color" />
                        </div>
                      </td>
                      <td className="flex-column gap-0">
                        <h2 className="subheading">
                          <Link to={`/mountain/${hill.slug}`}>{hill.name}{hill.name_secondary ? <span className="secondary-text"> ({hill.name_secondary})</span> : ""}</Link>
                        </h2>
                        <span className="secondary-text">{titles[hill.book]}</span>
                      </td>
                      <td className="text-center"><Height m={hill.height} /></td>
                    </tr>
                  )
                })
              : `No mountains matching '${filterTerm}'`
              }
            </tbody>
          </table>
        </div>
      </section>

    </main>
  )
}