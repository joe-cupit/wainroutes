import { useMemo, useState } from "react"
import { displayDistance } from "../../../utils/unitConversions"


export function EstimatedTime({ selected, walkLengthInKm }) {

  const [speedInKm, setSpeedInKm] = useState(3)

  const timeTaken = useMemo(() => {
    let time = walkLengthInKm / speedInKm

    if (time < 1) return (time * 60).toFixed(0) + " mins"
    else return time.toFixed(1) + " hours"
  }, [walkLengthInKm, speedInKm])


  return (
    <div className={"walk-page_estimated-time walk-page_aside-section" + (selected ? " selected" : "")}>
      <h2 className="subheading">Estimated Time</h2>
      <p aria-live="polite">An average pace of {displayDistance(speedInKm, 1) + "/h"} completes this walk in {timeTaken}</p>
      <input type="range"
        min={1} max={6} step={0.1}
        value={speedInKm} onChange={e => setSpeedInKm(e.target.value)}
        aria-label="Walking speed"
      />
      {/* <p className="subtext">*always allow ample time to complete walks in the mountains</p> */}
      <p className="subtext">*hiking pace in the mountains is always slower than on flat ground</p>
    </div>
  )
}