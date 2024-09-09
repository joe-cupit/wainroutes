import "./home.css";

import { Link } from "react-router-dom";
import { LakeMap } from "../components/map";
import { useMemo } from "react";
import { useHillMarkers, useWalkMarkers } from "../hooks/useMarkers";


export function HomePage() {

  document.title = "wainroutes";

  const hillMarkers = useHillMarkers();
  const walkMarkers = useWalkMarkers();

  const mapMarkers = useMemo(() => {
    // return [...(hillMarkers ?? []), ...(walkMarkers ?? [])]
    return [...(hillMarkers ?? [])]
  }, [hillMarkers, walkMarkers])

  return (
  <main className="home-page">

    <header className="grid-group">
      <h1 className="page-title">wain<span className="home-page--title-wright">wright:</span>routes</h1>
      <p className="text--smallheading">Lake District walks covering the 214 Wainwrights</p>
      {/* <div className="home-page--links text--subtext font--urbanist">
        <Link to="/walks">walks</Link>
        <Link to="/mountains">mountains</Link>
        <Link to="/weather">weather</Link>
        <Link to="/travel">travel</Link>
      </div> */}
      <p className="flex-group flex-horizontal-center">
        <Link className="home-page_button" to="/walks">Go for a walk →</Link>
        <Link className="home-page_button" to="/mountains">Find a mountain ^</Link>
      </p>
    </header>

    {/* <div className="home-page--map">
      <LakeMap mapMarkers={mapMarkers} />
    </div> */}

    <div style={{height: "670px"}}>

    </div>
    
  </main>
  )
}