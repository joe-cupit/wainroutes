import { useMemo, useState } from "react"
import { displayDistance } from "../../../utils/unitConversions"


const localStorageName = "user-set-hiking-speed";

export function EstimatedTime({ selected, walkLengthInKm } : { selected: boolean; walkLengthInKm: number | undefined }) {
  if (!walkLengthInKm) return <></>;

  const [speedInKm, setSpeedInKm] = useState<number>(Number(localStorage.getItem(localStorageName) ?? "2.5"));

  const timeTaken = useMemo(() => {
    localStorage.setItem(localStorageName, String(speedInKm));

    let time = (walkLengthInKm ?? 0) / speedInKm;

    if (time < 1) return (time * 60).toFixed(0) + " mins";
    else return time.toFixed(1) + " hours";
  }, [walkLengthInKm, speedInKm])


  return (
    <div className={"walk-page_estimated-time walk-page_aside-section" + (selected ? " selected" : "")}>
      <h2 className="subheading">Estimated Time</h2>
      <p aria-live="polite">An average hiking pace of <b>{displayDistance(speedInKm, 1) + "/h"}</b> completes this walk in <b>{timeTaken}</b></p>
      <input type="range"
        min={1} max={6} step={0.1}
        value={speedInKm} onChange={e => setSpeedInKm(Number(e.target.value))}
        aria-label="Walking speed"
      />
      {/* <p className="subtext">*always allow ample time to complete walks in the mountains</p> */}
      {/* <p className="subtext">*hiking pace in the mountains is always slower than on flat ground</p> */}
    </div>
  )
}