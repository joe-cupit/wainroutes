"use client";

import styles from "../Aside.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { useEffect, useMemo, useState } from "react";

import { TerrainLevel } from "@/types/Walk";

const localStorageName = "user-set-hiking-speed";
const speedNames = {
  1: "slow",
  2: "leisurely",
  3: "steady",
  4: "quick",
};

export default function EstimatedTime({
  selected,
  walkLengthInKm,
  elevationImM,
  steepness,
}: {
  selected: boolean;
  walkLengthInKm: number;
  elevationImM: number;
  steepness: TerrainLevel;
}) {
  const [speedInKm, setSpeedInKm] = useState<1 | 2 | 3 | 4>(
    (Number(localStorage.getItem(localStorageName)) as 1 | 2 | 3 | 4) ?? 2
  );

  useEffect(() => {
    const storedSpeed = Number(localStorage.getItem(localStorageName));
    console.log(storedSpeed);
    if ([1, 2, 3, 4].includes(storedSpeed))
      setSpeedInKm(storedSpeed as 1 | 2 | 3 | 4);
  }, []);

  const timeTaken = useMemo(() => {
    localStorage.setItem(localStorageName, String(speedInKm));

    const horizontalSpeed = {
      1: 2.25,
      2: 3.25,
      3: 4.5,
      4: 5.75,
    };
    const timePer300m = {
      1: 38,
      2: 34,
      3: 30,
      4: 27,
    };
    const steepnessFix = {
      1: -5,
      2: 0,
      3: 10,
      4: 15,
    };

    const time =
      walkLengthInKm / horizontalSpeed[speedInKm] +
      ((elevationImM / 300) *
        (timePer300m[speedInKm] + steepnessFix[steepness])) /
        60;

    let hours = Math.floor(time);
    let mins = Math.ceil(((time - hours) * 60) / 5) * 5;
    if (mins >= 60) {
      hours += 1;
      mins -= 60;
    }

    return `${hours} hour${hours !== 1 ? "s" : ""} ${mins} mins`;
  }, [walkLengthInKm, speedInKm]);

  return (
    <div
      className={`${styles.estimatedTime} ${styles.asideSection} ${
        selected ? styles.selected : ""
      }`}
    >
      <h2 className={fontStyles.subheading}>Estimated Time</h2>
      <p aria-live="polite">
        A <b>{speedNames[speedInKm]}</b> hiking pace finishes this walk in
        around <b>{timeTaken}</b>
      </p>
      <input
        type="range"
        min={1}
        max={4}
        step={1}
        value={speedInKm}
        onChange={(e) => setSpeedInKm(Number(e.target.value) as 1 | 2 | 3 | 4)}
        aria-label="Walking speed"
      />
      {/* <p className={fontStyles.subtext}>*always allow ample time to complete walks in the mountains</p> */}
      {/* <p className={fontStyles.subtext}>*hiking pace in the mountains is always slower than on flat ground</p> */}
    </div>
  );
}
