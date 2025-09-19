"use client"

import styles from "../../../Walk.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { useEffect, useMemo, useState } from "react";

import { displayDistance } from "@/utils/unitConversions";


const localStorageName = "user-set-hiking-speed";

export default function EstimatedTime({ selected, walkLengthInKm } : { selected: boolean; walkLengthInKm: number | undefined }) {

  const [speedInKm, setSpeedInKm] = useState<number>(2.5);

  useEffect(() => {
    const storedSpeed = localStorage.getItem(localStorageName);
    if (storedSpeed) setSpeedInKm(Number(storedSpeed));
  }, [])

  const timeTaken = useMemo(() => {
    if (speedInKm !== 2.5)
      localStorage.setItem(localStorageName, String(speedInKm));

    const time = (walkLengthInKm ?? 0) / speedInKm;

    if (time < 1) return (time * 60).toFixed(0) + " mins";
    else return time.toFixed(1) + " hours";
  }, [walkLengthInKm, speedInKm])


  return (
    <div className={`${styles.estimatedTime} ${styles.asideSection} ${selected ? styles.selected : ""}`}>
      <h2 className={fontStyles.subheading}>Estimated Time</h2>
      <p aria-live="polite">An average hiking pace of <b>{displayDistance(speedInKm, 1) + "/h"}</b> completes this walk in <b>{timeTaken}</b></p>
      <input type="range"
        min={1} max={5} step={0.1}
        value={speedInKm} onChange={e => setSpeedInKm(Number(e.target.value))}
        aria-label="Walking speed"
      />
      {/* <p className={fontStyles.subtext}>*always allow ample time to complete walks in the mountains</p> */}
      {/* <p className={fontStyles.subtext}>*hiking pace in the mountains is always slower than on flat ground</p> */}
    </div>
  )
}