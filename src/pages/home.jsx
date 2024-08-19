import "../styles/home.css";

import { Link } from "react-router-dom";
import { LakeMap } from "./map";


export function HomePage() {
  return (
  <main className="home-page">
    <header>
      <h1>Wainwright Walks</h1>
      <div className="home-page--links">
        <Link to="/walks">walks</Link>
        <Link to="/mountains">mountains</Link>
        <Link to="/weather">weather</Link>
        <Link to="/more">more</Link>
      </div>
    </header>
    <LakeMap />
  </main>
  )
}