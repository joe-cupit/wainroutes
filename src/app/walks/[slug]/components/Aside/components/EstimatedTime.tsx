"use client";

import styles from "../Aside.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { useEffect, useState } from "react";

const localStorageName = "user-set-hiking-speed";
const speedNames: { [num: number]: string } = {
  1: "slow",
  2: "leisurely",
  3: "steady",
  4: "quick",
};

export default function EstimatedTime({
  selected,
  estimatedTimes,
}: {
  selected: boolean;
  estimatedTimes: { [level: number]: string };
}) {
  const [speedLevel, setSpeedLevel] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = Number(localStorage.getItem(localStorageName));
      if ([1, 2, 3, 4].includes(stored)) return stored;
    }
    return 2;
  });

  useEffect(() => {
    localStorage.setItem(localStorageName, String(speedLevel));
  }, [speedLevel]);

  return (
    <div
      className={`${styles.estimatedTime} ${styles.asideSection} ${
        selected ? styles.selected : ""
      }`}
    >
      <h2 className={fontStyles.subheading}>Estimated Time</h2>
      <p aria-live="polite">
        A <b>{speedNames[speedLevel]}</b> hiking pace finishes this walk in
        around <b>{estimatedTimes[speedLevel]}</b>
      </p>
      <input
        type="range"
        min={1}
        max={4}
        step={1}
        value={speedLevel}
        onChange={(e) => setSpeedLevel(Number(e.target.value) as 1 | 2 | 3 | 4)}
        aria-label="Walking speed"
      />
      {/* <p className={fontStyles.subtext}>*always allow ample time to complete walks in the mountains</p> */}
      {/* <p className={fontStyles.subtext}>*hiking pace in the mountains is always slower than on flat ground</p> */}
    </div>
  );
}
