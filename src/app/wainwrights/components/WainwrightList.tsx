"use client";

import styles from "../Wainwrights.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

import type { SimplifiedHill } from "../page";
import { BookTitles } from "@/types/Hill";
import { displayElevation } from "@/utils/unitConversions";
import { CloseIconSmall, SearchIcon } from "@/icons/MaterialIcons";

type WainwrightListProps = {
  simplifiedHills: SimplifiedHill[];
  setHoveredSlug: React.Dispatch<React.SetStateAction<string | null>>;
  book: number;
};

export default function WainwrightList({
  simplifiedHills,
  setHoveredSlug,
  book,
}: WainwrightListProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  useEffect(() => {
    if (inputValue === "") {
      setFilterTerm("");
      return;
    }

    const handler = setTimeout(() => {
      setFilterTerm(inputValue);
    }, 250);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    const head = document.getElementById("table-head");
    const body = document.getElementById("table-body");
    const button = document.getElementById("back-to-top-button");

    function checkScroll() {
      console.log(body?.scrollHeight, body?.clientHeight);
      if (head && body) {
        if (body.scrollTop > 0) head.classList.add(styles.floating);
        else head.classList.remove(styles.floating);

        // if (body.scrollHeight <= body.clientHeight) body.classList.remove(styles.floating);
        if (body.scrollTop >= body.scrollHeight - body.clientHeight - 10)
          body.classList.remove(styles.floating);
        else body.classList.add(styles.floating);

        if (button) {
          if (body.scrollTop > 100) button.classList.add(styles.floating);
          else button.classList.remove(styles.floating);
        }
      }
    }

    checkScroll();
    body?.addEventListener("scroll", checkScroll);
    return () => {
      body?.removeEventListener("scroll", checkScroll);
    };
  }, [filterTerm]);

  const [sortMode, setSortMode] = useState("height");
  const [sortStates, setSortStates] = useState([false, false, true]);

  const searchableHills = useMemo(() => {
    return new Fuse(simplifiedHills, {
      keys: ["name"],
      threshold: 0.25,
    });
  }, [simplifiedHills]);

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
    } else {
      setSortMode(newSortMode);
    }
  }

  const filteredHills = useMemo(() => {
    if (filterTerm.length > 0) {
      return searchableHills.search(filterTerm).map((res) => res.item);
    } else return simplifiedHills;
  }, [simplifiedHills, searchableHills, filterTerm]);

  const sortedHills = useMemo(() => {
    switch (sortMode) {
      case "book":
        if (!sortStates[0])
          return [...filteredHills].sort((a, b) => a.book - b.book);
        else return [...filteredHills].sort((b, a) => a.book - b.book);
      case "mountain":
        if (!sortStates[1])
          return [...filteredHills].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        else
          return [...filteredHills].sort((b, a) =>
            a.name.localeCompare(b.name)
          );
      case "height":
        if (!sortStates[2])
          return [...filteredHills].sort((a, b) => a.height - b.height);
        else return [...filteredHills].sort((b, a) => a.height - b.height);
      default:
        return [];
    }
  }, [filteredHills, sortMode, sortStates]);

  return (
    <div className={styles.list}>
      <div className={styles.search} onClick={() => inputRef.current?.focus()}>
        <SearchIcon />
        <input
          type="text"
          ref={inputRef}
          placeholder="search the list of fells"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        {inputValue.length > 0 && (
          <button
            className={styles.searchButton}
            onClick={() => setInputValue("")}
            title="Clear search"
          >
            <CloseIconSmall />
          </button>
        )}
      </div>

      <button
        id="back-to-top-button"
        className={styles.backToTop}
        onClick={() => {
          document.getElementById("table-body")?.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }}
      >
        Back to top
      </button>

      <table className={styles.table}>
        <thead id="table-head">
          <tr>
            <td role="button" onClick={() => updateSortMode("book")}>
              Book&nbsp;
              <span
                className={`${styles.tableArrow} ${
                  sortMode === "book" ? styles.active : ""
                }`}
              >
                {sortStates[0] ? "↓" : "↑"}
              </span>
            </td>
            <td
              role="button"
              onClick={() => updateSortMode("mountain")}
              className={styles.mountainHeading}
            >
              Mountain&nbsp;
              <span
                className={`${styles.tableArrow} ${
                  sortMode === "mountain" ? styles.active : ""
                }`}
              >
                {sortStates[1] ? "↓" : "↑"}
              </span>
            </td>
            <td role="button" onClick={() => updateSortMode("height")}>
              Height&nbsp;
              <span
                className={`${styles.tableArrow} ${
                  sortMode === "height" ? styles.active : ""
                }`}
              >
                {sortStates[2] ? "↓" : "↑"}
              </span>
            </td>
          </tr>
        </thead>
        <tbody id="table-body">
          {sortedHills.length > 0 &&
            sortedHills?.map((hill, index) => {
              return (
                <tr key={index}>
                  <td>
                    <button
                      onClick={() =>
                        window.history.replaceState(
                          {},
                          "",
                          hill.book === book
                            ? "/wainwrights"
                            : `/wainwrights?book=${hill.book}`
                        )
                      }
                      className={styles.wainwrightBookTop}
                      data-book={hill.book}
                      title={BookTitles[hill.book]}
                    >
                      <div className={styles.wainwrightBookTopColour} />
                    </button>
                  </td>
                  <td>
                    <h2 className={fontStyles.subheading}>
                      <Link
                        href={`/wainwrights/${hill.slug}`}
                        onMouseEnter={() => setHoveredSlug(hill.slug)}
                        onMouseLeave={() => setHoveredSlug(null)}
                      >
                        {hill.name}{" "}
                        {hill.secondaryName ? (
                          <span
                            className={`${styles.secondaryName} ${fontStyles.subtext}`}
                          >
                            ({hill.secondaryName})
                          </span>
                        ) : (
                          ""
                        )}
                      </Link>
                    </h2>
                    <span className={fontStyles.subtext}>
                      {BookTitles[hill.book]}
                    </span>
                  </td>
                  <td>{displayElevation(hill.height)}</td>
                </tr>
              );
            })}

          {filterTerm && (
            <tr>
              <td className={styles.listNote} colSpan={3}>
                {filteredHills.length === 0 ? "No" : "Showing all"} Wainwrights
                matching <i>{"'" + filterTerm + "'"}</i>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
