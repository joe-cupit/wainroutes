import "../styles/home.css";

import { Link } from "react-router-dom";
import { LakeMap } from "../map/map";
import { useMemo } from "react";
import { useHillMarkers, useWalkMarkers } from "../map/useMarkers";


export function HomePage() {

  const hillMarkers = useHillMarkers();
  const walkMarkers = useWalkMarkers();

  const mapMarkers = useMemo(() => {
    // return [...(hillMarkers ?? []), ...(walkMarkers ?? [])]
    return [...(hillMarkers ?? [])]
  }, [hillMarkers, walkMarkers])

  return (
  <main className="home-page">

    <header>
      <h1 className="home-page--title text--title">wain<span className="home-page--title-wright">wright:</span>routes</h1>
      <div className="home-page--links text--subtext font--urbanist">
        <Link to="/walks">walks</Link>
        <Link to="/mountains">mountains</Link>
        <Link to="/weather">weather</Link>
        <Link to="/travel">travel</Link>
      </div>
    </header>

    <div className="home-page--map">
      <LakeMap mapMarkers={mapMarkers} />
    </div>

    <div style={{height: "670px"}}></div>
    
  </main>
  )
}