import "../styles/home.css";

import { Link } from "react-router-dom";
import { LakeMap } from "../components/map";


export function HomePage() {

  return (
  <main className="home-page">

    <header>
      <h1 className="home-page--title">wain<span className="home-page--title-wright">wright:</span>routes</h1>
      <div className="home-page--links">
        <Link to="/walks">walks</Link>
        <Link to="/mountains">mountains</Link>
        <Link to="/weather">weather</Link>
        <Link to="/travel">travel</Link>
      </div>
    </header>

    <div className="home-page--map">
      <LakeMap showWainwrights={true} showWalkroutes={true} />
    </div>

    <div style={{height: "670px"}}></div>
    
  </main>
  )
}