"use client";

import styles from "../../Walk.module.css";

import { useState } from "react";

import EstimatedTime from "./components/EstimatedTime";
import StartingLocation from "./components/StartingLocation";
import Terrain from "./components/Terrain";
import Walk from "@/types/Walk";


type AsideProps = {
  startLocation: Walk["startLocation"];
  busConnections: Walk["busConnections"];
  walkLength: Walk["length"];
  terrain: Walk["terrain"];
}


export default function WalkAside({ startLocation, busConnections, walkLength, terrain } : AsideProps) {

  const [asideTabIndex, setAsideTabIndex] = useState(-1);
  function toggleAsideTab(newIndex: number) {
    if (newIndex === asideTabIndex) {
      setAsideTabIndex(-1);
    }
    else {
      setAsideTabIndex(newIndex);
    }
  }


  return (
    <div className={styles.aside}>
      <div className={styles.asideTabs}>
        <button
          className={`${styles.asideTab} ${asideTabIndex === 1 ? styles.selected : ""}`}
          onClick={() => toggleAsideTab(1)}
        >
          Start Loc
        </button>
        <button
          className={`${styles.asideTab} ${asideTabIndex === 2 ? styles.selected : ""}`}
          onClick={() => toggleAsideTab(2)}
        >
          Est Time
        </button>
        <button
          className={`${styles.asideTab} ${asideTabIndex === 3 ? styles.selected : ""}`}
          onClick={() => toggleAsideTab(3)}
        >
          Terrain
        </button>
      </div>

      {/* <div className={styles.asideImage}>
        <LazyImage
          name={slug + "_" + gallery?.coverId}
          sizes="(min-width: 300px) 300px, 90vw"
        />
      </div> */}

      <div className={`${styles.asideContent} ${[1, 2, 3].includes(asideTabIndex) ? styles.visible : ""}`}>
        <StartingLocation selected={asideTabIndex === 1}
          startLocation={startLocation}
          busRoutes={busConnections}
        />
        <EstimatedTime selected={asideTabIndex === 2}
          walkLengthInKm={walkLength}
        />
        <Terrain selected={asideTabIndex === 3}
          walkTerrain={terrain}
        />
      </div>
    </div>
  )
}
