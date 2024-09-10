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

    <header className="home-page_hero grid-group">
      <div>
        <h1 className="home-page_title">wain<span className="home-page--title-wright">wright:</span>routes</h1>
        <p className="home-page_tagline">Lake District <span className="cursive">walks</span> covering the 214 Wainwrights</p>        
      </div>

      <div className="home-page_buttons flex-group flex-horizontal-center">
        <Link className="home-page_button walks" to="/walks">
          Go for a walk
          <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" fill="none" viewBox="-0.5 -11.207 17.19 11.71">
            <path d="M 0 0 C 0.128 -0.892 0.308 -1.61 1.006 -2.248 M 2.243 -3.505 C 2.822 -4.083 3.44 -4.562 4.558 -4.602 M 6.194 -4.542 C 7.131 -4.462 7.63 -4.003 8.528 -4.103 M 10.483 -4.422 C 11.321 -4.622 11.58 -5.141 11.94 -5.998 M 12.518 -7.814 C 12.897 -8.612 13.994 -9.151 15.052 -9.071 M 12.738 -10.707 C 13.975 -9.949 14.433 -9.689 16.189 -9.231 C 15.531 -8.472 15.251 -7.814 15.052 -6.378" />
          </svg>
        </Link>
        <Link className="home-page_button mountains" to="/mountains">
          Find a mountain
          <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" fill="none" viewBox="-0.5 -5.98057 8 6.481">
            <path d="M 0 0 C 1.322 -0.932 2.149 -3.989 3 -5 C 3.77 -6.069 3.816 -5.334 5 -3 C 6 -1 5.758 -1.024 7 0 M 1.552 -3.161 L 2.643 -2.345 L 3.379 -3.07 L 4.103 -2.219 L 5.873 -2.966" />
          </svg>
        </Link>
      </div>
    </header>

    {/* <div className="home-page--map">
      <LakeMap mapMarkers={mapMarkers} />
    </div> */}

    <div style={{height: "670px"}}>

    </div>
    
  </main>
  )
}