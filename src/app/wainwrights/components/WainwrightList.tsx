"use client";

import styles from "../Wainwrights.module.css";
import fontStyles from "@/app/fonts.module.css";

import { useMemo, useState } from "react";
import Link from "next/link";

import Hill, { BookTitles } from "@/types/Hill";
import { displayElevation } from "@/utils/unitConversions";

import wainsJson from "@/data/hills.json";


export default function WainwrightList() {

  const hillData = wainsJson as Hill[];

  const [filterTerm, setFilterTerm] = useState("");
  const [sortMode, setSortMode] = useState("height");
  const [sortStates, setSortStates] = useState([false, false, true]);


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


  return (
    <div className={styles.list}>

      <div className={styles.search}>
        <input type="text"
          placeholder="search for a fell"
          value={filterTerm}
          onChange={e => setFilterTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <td role="button" onClick={() => updateSortMode("book")}>
              Book&nbsp;
              <span className={`${styles.tableArrow} ${sortMode==="book" ? styles.active : ""}`}>
                {sortStates[0] ? "↓": "↑"}
              </span>
            </td>
            <td role="button" onClick={() => updateSortMode("mountain")} className={styles.mountainHeading}>
              Mountain&nbsp;
              <span className={`${styles.tableArrow} ${sortMode==="mountain" ? styles.active : ""}`}>
                {sortStates[1] ? "↓": "↑"}
              </span>
            </td>
            <td role="button" onClick={() => updateSortMode("height")}>
              Height&nbsp;
              <span className={`${styles.tableArrow} ${sortMode==="height" ? styles.active : ""}`}>
                {sortStates[2] ? "↓": "↑"}
              </span>
            </td>
          </tr>
        </thead>
        <tbody>
          {filteredHills.length > 0 &&
            filteredHills?.map((hill, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className={styles.wainwrightBookTop} data-book={hill.book} title={BookTitles[hill.book]}>
                      <div className={styles.wainwrightBookTopColour} />
                    </div>
                  </td>
                  <td className={styles.mountainColumn}>
                    <h2 className={fontStyles.subheading}>
                      <Link
                        href={`/wainwrights/${hill.slug}`}
                        // onMouseEnter={() => setHoveredSlug(hill.slug)}
                        // onMouseLeave={() => setHoveredSlug(null)}
                      >
                        {hill.name}{hill.secondaryName ? <span className={fontStyles.subtext}> ({hill.secondaryName})</span> : ""}
                      </Link>
                    </h2>
                    <span className={fontStyles.subtext}>{BookTitles[hill.book]}</span>
                  </td>
                  <td className={styles.tableHeight}>{displayElevation(hill.height)}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      {filterTerm && <p className={styles.listNote}>{filteredHills.length === 0 ? "No" : "Showing all"} Wainwrights matching <i>{"'"+filterTerm+"'"}</i></p>}
    </div>
  )
}